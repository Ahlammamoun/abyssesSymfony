<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
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



class DefaultController extends AbstractController
{


    #[Route('/{reactRouting}', name: 'react_app', requirements: ['reactRouting' => '^(?!api).*$'], defaults: ['reactRouting' => null])]
    public function index(): Response
    {
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

    #[Route('/api/species/{id}/avis', name: 'api_add_avis', methods: ['POST'])]
    public function addAvis(
        $id,
        Request $request,
        SpeciesRepository $speciesRepository,
        EntityManagerInterface $em
    ): JsonResponse {
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
}
