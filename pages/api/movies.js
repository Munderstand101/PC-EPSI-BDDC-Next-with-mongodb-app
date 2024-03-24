// pages/api/movies.js
import { findDocuments, insertDocument } from "../../servicies/mongodbService";
import Movie from "../../models/Movie";
import NextCors from 'nextjs-cors';

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags:
 *        - Movies
 *     summary: Get all movies
 *     description: Retrieve a list of all movies.
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal Server Error
 *   post:
 *     tags:
 *        - Movies
 *     summary: Create a new movie
 *     description: Add a new movie to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie added successfully
 *       400:
 *         description: Bad Request. Missing required fields.
 *       500:
 *         description: Internal Server Error
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         plot:
 *           type: string
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         runtime:
 *           type: number
 *         cast:
 *           type: array
 *           items:
 *             type: string
 *         poster:
 *           type: string
 *         title:
 *           type: string
 *         fullplot:
 *           type: string
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *         released:
 *           type: string
 *           format: date-time
 *         directors:
 *           type: array
 *           items:
 *             type: string
 *         rated:
 *           type: string
 *         awards:
 *           type: string
 *         lastupdated:
 *           type: string
 *           format: date-time
 *         year:
 *           type: number
 *         imdb:
 *           type: object
 *           properties:
 *             rating:
 *               type: number
 *             votes:
 *               type: number
 *             id:
 *               type: string
 *         countries:
 *           type: array
 *           items:
 *             type: string
 *         type:
 *           type: string
 *         tomatoes:
 *           type: object
 *           properties:
 *             viewer:
 *               type: object
 *               properties:
 *                 rating:
 *                   type: number
 *                 numReviews:
 *                   type: number
 *                 meter:
 *                   type: number
 *             lastUpdated:
 *               type: string
 *               format: date-time
 *         num_mflix_comments:
 *           type: number
 *       required:
 *         - plot
 *         - genres
 *         - runtime
 *         - cast
 *         - poster
 *         - title
 *         - fullplot
 *         - languages
 *         - released
 *         - directors
 *         - rated
 *         - awards
 *         - lastupdated
 *         - year
 *         - imdb
 *         - countries
 *         - type
 *         - tomatoes
 *         - num_mflix_comments
 */
export default async function handler(req, res) {

    // Initialize the cors middleware
    await NextCors(req, res, {
        methods: ['GET', 'POST'], // Specify the methods allowed
        origin: '*', // Adjust according to your needs, '*' allows all origins
        optionsSuccessStatus: 200,
    });

    switch (req.method) {
        case "GET":
            try {
                const movies = await findDocuments("movies");
                return res.status(200).json({ status: 200, data: movies });
            } catch (error) {
                console.error("Error fetching movies:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

        case "POST":
            try {
                const movieData = new Movie(req.body);

                // Ensure that required fields are present in the request
                if (!Movie.validateRequiredFields(movieData)) {
                    return res.status(400).json({ error: "Bad Request. Missing required fields." });
                }

                // Log the request payload for debugging
                // console.log("Request Payload:", req.body);

                const newMovie = await insertDocument("movies", movieData);

                // Log the result of the document insertion
                // console.log("New Movie:", newMovie);


                return res.status(201).json({ status: 201, data: newMovie, message: "Movie added successfully" });
            } catch (error) {
                console.error("Error adding new movie:", error);
                return res.status(500).json({ error: "Internal Server Error", details: error.message });
            }

        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
