<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Category;
use App\Entity\Species;
use App\Entity\Type;
use App\Repository\CategoryRepository;
use App\Repository\SpeciesRepository;
use App\Repository\TypeRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\SerializerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Avis;
use App\Repository\AvisRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;







class DefaultController extends AbstractController
{


    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }


    #[Route('/{reactRouting}', name: 'react_app', requirements: ['reactRouting' => '^(?!api/).*'])]
    public function index(LoggerInterface $logger): Response
    {
        $logger->info("Test de log Symfony");
        return $this->render('base.html.twig');
    }



    #[Route('/api/categories', name: 'api_get_categories', methods: ['GET'])]
    public function getCategories(CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findAll();
        $data = [];
        // dump($categories);

        foreach ($categories as $category) {
            $data[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'picture' => $category->getPicture(),
                'date' => $category->getDate()->format('Y-m-d H:i:s'),
                'avis' => $category->getAvis(),
            ];
        }

        return new JsonResponse($data);
    }

    //route qui permet de créer une categorie et ses espèces et leurs types
    #[Route('/api/categories-with-species', name: 'api_create_category_with_species', methods: ['POST'])]
    public function createCategoryWithSpecies(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Récupérer les données de la catégorie et de l'espèce
        $categoryData = $data['category'] ?? null;
        $speciesData = $data['species'] ?? null;

        if (!$categoryData || !$speciesData) {
            return new JsonResponse(['error' => 'Category or Species data missing'], 400);
        }

        // Créer la nouvelle catégorie
        $category = new Category();
        $category->setName($categoryData['name']);
        $category->setDescription($categoryData['description'] ?? null);
        $category->setPicture($categoryData['picture'] ?? null);
        $category->setDate(new \DateTime());

        // Récupérer le type en utilisant type_id fourni
        $typeId = $speciesData['type_id'] ?? null;
        if (!$typeId) {
            return new JsonResponse(['error' => 'Type ID is required for species'], 400);
        }

        // Log de vérification
        $this->logger->info('Type ID reçu:', ['type_id' => $typeId]);

        $type = $em->getRepository(Type::class)->find($typeId);
        if (!$type) {
            return new JsonResponse(['error' => 'Type not found'], 404);
        }

        // Créer la nouvelle espèce
        $species = new Species();
        $species->setName($speciesData['name']);
        $species->setDescription($speciesData['description'] ?? null);
        $species->setPicture($speciesData['picture'] ?? null);
        $species->setDate(new \DateTime());

        // Associer l'espèce à la catégorie et au type
        $species->setCategory($category);
        $species->setType($type);

        // Persister les deux entités
        $em->persist($category);
        $em->persist($species);
        $em->flush();

        return new JsonResponse(['status' => 'Category and Species created successfully'], 201);
    }


    #[Route('/api/categories-with-species/{id}', name: 'api_update_category_with_species', methods: ['PUT'])]
    public function updateCategoryWithSpecies(
        int $id,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        // Récupérer l'utilisateur de la session
        $session = $request->getSession();
        $user = $session->get('user');
   
      
        // Vérifier que l'utilisateur est authentifié et possède le rôle ADMIN
        if (!$user || !in_array('ROLE_ADMIN', $user->getRoles(), true)) {
            return new JsonResponse(['error' => 'Access Denied'], 403);
        }
        $data = json_decode($request->getContent(), true);

        // Récupérer la catégorie existante
        $category = $em->getRepository(Category::class)->find($id);
        if (!$category) {
            return new JsonResponse(['error' => 'Category not found'], 404);
        }

        // Récupérer les données de la catégorie et de l'espèce
        $categoryData = $data['category'] ?? null;
        $speciesDataList = $data['species'] ?? null;

        if (!$categoryData || !$speciesDataList) {
            return new JsonResponse(['error' => 'Category or Species data missing'], 400);
        }

        // Mettre à jour les informations de la catégorie
        $category->setName($categoryData['name']);
        $category->setDescription($categoryData['description'] ?? null);
        $category->setPicture($categoryData['picture'] ?? null);

        // Mettre à jour ou créer les espèces
        foreach ($speciesDataList as $speciesData) {
            $speciesId = $speciesData['id'] ?? null;

            if ($speciesId) {
                // Mettre à jour l'espèce existante
                $species = $em->getRepository(Species::class)->find($speciesId);
                if ($species && $species->getCategory()->getId() === $id) {
                    $species->setName($speciesData['name']);
                    $species->setDescription($speciesData['description'] ?? null);
                    $species->setPicture($speciesData['picture'] ?? null);
                    $species->setDate(new \DateTime()); // Mettre à jour avec la date actuelle

                    $typeId = $speciesData['type_id'] ?? null;
                    if ($typeId) {
                        $type = $em->getRepository(Type::class)->find($typeId);
                        if ($type) {
                            $species->setType($type);
                        } else {
                            return new JsonResponse(['error' => 'Type not found'], 404);
                        }
                    }
                }
            } else {
                // Ajouter une nouvelle espèce
                $newSpecies = new Species();
                $newSpecies->setName($speciesData['name']);
                $newSpecies->setDescription($speciesData['description'] ?? null);
                $newSpecies->setPicture($speciesData['picture'] ?? null);
                $newSpecies->setDate(new \DateTime()); // Date actuelle pour la nouvelle espèce
                $newSpecies->setCategory($category);

                $typeId = $speciesData['type_id'] ?? null;
                if ($typeId) {
                    $type = $em->getRepository(Type::class)->find($typeId);
                    if ($type) {
                        $newSpecies->setType($type);
                    } else {
                        return new JsonResponse(['error' => 'Type not found'], 404);
                    }
                }
                $em->persist($newSpecies);
            }
        }

        // Sauvegarder les modifications
        $em->flush();

        return new JsonResponse(['status' => 'Category and Species updated successfully'], 200);
    }

    // Delete a category
    #[Route('/api/categories/{id}', name: 'api_delete_category', methods: ['DELETE'])]
    public function deleteCategory(int $id, CategoryRepository $categoryRepository, EntityManagerInterface $em, LoggerInterface $logger): JsonResponse
    {
        $category = $categoryRepository->find($id);

        if (!$category) {
            $logger->error("Category with id $id not found for deletion.");
            return new JsonResponse(['error' => 'Category not found'], 404);
        }

        try {
            $em->remove($category);
            $em->flush();
            $logger->info("Category with id $id deleted successfully.");
            return new JsonResponse(['status' => 'Category deleted successfully']);
        } catch (\Exception $e) {
            $logger->error("Error deleting category with id $id: " . $e->getMessage());
            return new JsonResponse(['error' => 'Error deleting category'], 500);
        }
    }


    #[Route('/api/categories/{id}', name: 'api_get_category', methods: ['GET'])]
    public function getCategory(int $id, CategoryRepository $categoryRepository): JsonResponse
    {
        $category = $categoryRepository->find($id);

        if (!$category) {
            return new JsonResponse(['error' => 'Category not found'], 404);
        }
        // Construction manuelle du tableau des données de la catégorie
        $data = [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'description' => $category->getDescription(),
            'picture' => $category->getPicture(),
            'date' => $category->getDate() ? $category->getDate()->format('Y-m-d H:i:s') : null,
            'avis' => $category->getAvis()
        ];
        return new JsonResponse($data);
    }

    #[Route("/api/categories/{id}/species", name: "api_category_species", methods: ["GET"])]

    public function getSpeciesByCategory(int $id, SpeciesRepository $speciesRepository, LoggerInterface $logger,  Request $request): JsonResponse
    {
        try {
            $page = $request->query->get('page', 1);
            $limit = $request->query->get('limit', 6);
            $offset = ($page - 1) * $limit;

            $speciesList = $speciesRepository->findBy(['category' => $id], null, $limit, $offset);

            foreach ($speciesList as $species) {
                $data[] = [
                    'id' => $species->getId(),
                    'name' => $species->getName(),
                    'description' => $species->getDescription(),
                    'picture' => $species->getPicture(),
                    'avis' => $species->getAvis(),
                    'date' => $species->getDate()->format('Y-m-d H:i:s'),
                ];
            }

            $totalItems = $speciesRepository->count(['category' => $id]);
            $totalPages = ceil($totalItems / $limit);

            return new JsonResponse([
                'data' => $data,
                'totalItems' => $totalItems,
                'totalPages' => $totalPages,
                'currentPage' => $page,
            ]);
        } catch (\Exception $e) {
            // Vous pouvez logger l'erreur ici si nécessaire
            return new JsonResponse(['error' => 'Internal Server Error'], 500);
        }
    }

    #[Route("/api/species/{id}", name: "api_species_detail", methods: ["GET"])]
    public function getSpeciesDetail(
        int $id,
        SpeciesRepository $speciesRepository,
        AvisRepository $avisRepository,
        LoggerInterface $logger,
        Request $request
    ): JsonResponse {
        try {
            $species = $speciesRepository->find($id);

            if (!$species) {
                return new JsonResponse(['error' => 'Species not found'], 404);
            }

            // Paramètres pour la pagination
            $page = $request->query->get('page', 1);
            $limit = $request->query->get('limit', 3); // Limite par page
            $offset = ($page - 1) * $limit;

            // Récupération des avis avec pagination
            $totalAvis = $avisRepository->count(['species' => $species]);
            $avisCollection = $avisRepository->findBy(['species' => $species], ['date' => 'DESC'], $limit, $offset);

            $avisList = [];
            foreach ($avisCollection as $avis) {
                $avisList[] = [
                    'content' => $avis->getContent(),
                    'author' => $avis->getAuthor() ?? ($avis->getUser() ? $avis->getUser()->getUsername() : 'Anonyme'),
                    'email' => $avis->getEmail(),
                    'date' => $avis->getDate()->format('Y-m-d H:i:s'),
                    'rating' => $avis->getRating(),
                ];
            }

            // Préparation des données pour la réponse JSON
            $data = [
                'id' => $species->getId(),
                'name' => $species->getName(),
                'description' => $species->getDescription(),
                'picture' => $species->getPicture(),
                'categoryId' => $species->getCategory()->getId(),
                'avis' => $avisList,
                'totalPages' => ceil($totalAvis / $limit),
                'currentPage' => $page,
                'date' => $species->getDate()->format('Y-m-d H:i:s'),
            ];

            return new JsonResponse($data);
        } catch (\Exception $e) {
            $logger->error('Error fetching species detail: ' . $e->getMessage());
            return new JsonResponse(['error' => 'Internal Server Error'], 500);
        }
    }

    // Create a new species
    #[Route('/api/species', name: 'api_create_species', methods: ['POST'])]
    public function createSpecies(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $species = new Species();
        $species->setName($data['name']);
        $species->setDescription($data['description']);
        $species->setPicture($data['picture']);
        $species->setDate(new \DateTime());

        $em->persist($species);
        $em->flush();

        return new JsonResponse(['status' => 'Species created successfully'], 201);
    }


    // Route qui permet de supprimer une espèce par son ID
    #[Route('/api/species/{id}', name: 'api_delete_species', methods: ['DELETE'])]
    public function deleteSpecies(int $id, EntityManagerInterface $em, Request $request): JsonResponse
    {
        // Récupérer l'utilisateur de la session
        $session = $request->getSession();
        $user = $session->get('user');
   
      
        // Vérifier que l'utilisateur est authentifié et possède le rôle ADMIN
        if (!$user || !in_array('ROLE_ADMIN', $user->getRoles(), true)) {
            return new JsonResponse(['error' => 'Access Denied'], 403);
        }
        // Récupérer l'espèce à supprimer
        $species = $em->getRepository(Species::class)->find($id);

        if (!$species) {
            return new JsonResponse(['error' => 'Species not found'], 404);
        }

        // Supprimer l'espèce
        $em->remove($species);
        $em->flush();

        return new JsonResponse(['status' => 'Species deleted successfully'], 200);
    }

    #[Route('/api/species/{id}/avis', name: 'api_add_avis', methods: ['POST'])]
    // #[IsGranted('ROLE_ADMIN')] 
    // #[IsGranted('ROLE_USER')] // Restreindre l'accès aux utilisateurs ayant le rôle "ROLE_USER"
    public function addAvis(
        $id,
        Request $request,
        SpeciesRepository $speciesRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        // Récupérer l'utilisateur de la session
        $session = $request->getSession();
        $user = $session->get('user');

        // dump($user->getRoles());

        // Vérifiez si l'utilisateur a le rôle ADMIN
        if (!in_array('ROLE_ADMIN', $user->getRoles(), true) && !array('ROLE_USER', $user->getRoles())) {
            return new JsonResponse(['error' => 'Access Denied'], 403);
        }

        // if (!$user) {
        //     return new JsonResponse(['error' => 'User not authenticated'], 401);
        // }

        // // Affiche les rôles pour vérifier l'authentification
        // dump($user->getRoles());
        $species = $speciesRepository->find($id);

        if (!$species) {
            return new JsonResponse(['error' => 'Species not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $avis = new Avis();
        $avis->setContent($data['content']);
        $avis->setAuthor($data['author']);
        $avis->setEmail($data['email']);
        $avis->setDate(new \DateTime());
        $avis->setRating($data['rating']);

        try {
            $avis->setSpecies($species);
            $em->persist($avis);
            $em->flush();

            return new JsonResponse(['status' => 'Avis added successfully'], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }


    #[Route("/api/types/{id}/species", name: "api_type_species", methods: ["GET"])]
    public function getSpeciesByType(int $id, SpeciesRepository $speciesRepository, Request $request): JsonResponse
    {
        try {
            $page = $request->query->get('page', 1);
            $limit = $request->query->get('limit', 6);
            $offset = ($page - 1) * $limit;

            $speciesList = $speciesRepository->findBy(['type' => $id], null, $limit, $offset);

            $data = [];

            foreach ($speciesList as $species) {
                $data[] = [
                    'id' => $species->getId(),
                    'name' => $species->getName(),
                    'description' => $species->getDescription(),
                    'picture' => $species->getPicture(),
                    'avis' => $species->getAvis(),
                    'date' => $species->getDate()->format('Y-m-d H:i:s'),
                ];
            }

            $totalItems = $speciesRepository->count(['type' => $id]);
            $totalPages = ceil($totalItems / $limit);

            return new JsonResponse([
                'data' => $data,
                'totalItems' => $totalItems,
                'totalPages' => $totalPages,
                'currentPage' => $page,
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Internal Server Error'], 500);
        }
    }

    #[Route("/api/types", name: "api_types", methods: ["GET"])]
    public function getTypes(TypeRepository $typeRepository): JsonResponse
    {
        $types = $typeRepository->findAll();

        $data = [];

        foreach ($types as $type) {
            $data[] = [
                'id' => $type->getId(),
                'name' => $type->getName(),
                'description' => $type->getDescription(),
                'picture' => $type->getPicture(),
                'avis' => $type->getAvis(),
            ];
        }

        return new JsonResponse($data);
    }

    // Create a new type
    #[Route('/api/types', name: 'api_create_type', methods: ['POST'])]
    public function createType(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $type = new Type();
        $type->setName($data['name']);
        $type->setDescription($data['description']);
        $type->setPicture($data['picture']);

        $em->persist($type);
        $em->flush();

        return new JsonResponse(['status' => 'Type created successfully'], 201);
    }

    // Update a type
    #[Route('/api/types/{id}', name: 'api_update_type', methods: ['PUT'])]
    public function updateType(int $id, Request $request, TypeRepository $typeRepository, EntityManagerInterface $em): JsonResponse
    {
        $type = $typeRepository->find($id);

        if (!$type) {
            return new JsonResponse(['error' => 'Type not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $type->setName($data['name'] ?? $type->getName());
        $type->setDescription($data['description'] ?? $type->getDescription());
        $type->setPicture($data['picture'] ?? $type->getPicture());

        $em->flush();

        return new JsonResponse(['status' => 'Type updated successfully']);
    }

    // Delete a type
    #[Route('/api/types/{id}', name: 'api_delete_type', methods: ['DELETE'])]
    public function deleteType(int $id, TypeRepository $typeRepository, EntityManagerInterface $em): JsonResponse
    {
        $type = $typeRepository->find($id);

        if (!$type) {
            return new JsonResponse(['error' => 'Type not found'], 404);
        }

        $em->remove($type);
        $em->flush();

        return new JsonResponse(['status' => 'Type deleted successfully']);
    }






    #[Route('api/theme/toggle', name: 'theme_toggle', methods: ['POST'])]
    public function themeSwitcher(SessionInterface $session): JsonResponse
    {
        // Récupérer le thème actuel de la session (par défaut "dark")
        $currentTheme = $session->get('theme', 'dark');

        // Basculer entre "dark" et "light"
        $newTheme = $currentTheme === 'dark' ? 'light' : 'dark';

        // Stocker le nouveau thème dans la session
        $session->set('theme', $newTheme);

        // Retourner le nouveau thème sous forme de JSON
        return new JsonResponse(['theme' => $newTheme]);
    }

    // #[Route('/theme/current', name: 'theme_current', methods: ['GET'])]
    // public function getCurrentTheme(SessionInterface $session): JsonResponse
    // {
    //     // Retourner le thème actuel, par défaut "dark", sous forme de JSON
    //     $theme = $session->get('theme', 'dark');
    //     return new JsonResponse(['theme' => $theme]);
    // }


    #[Route('/session/test', name: 'session_test')]
    public function testSession(Request $request): JsonResponse
    {
        $session = $request->getSession();
        $session->set('test_key', 'test_value');

        return new JsonResponse(['test_key' => $session->get('test_key')]);
    }
}
