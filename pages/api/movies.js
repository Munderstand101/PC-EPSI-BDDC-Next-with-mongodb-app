// pages/api/movies.js
import { findDocuments, insertDocument } from "../../servicies/mongodbService";
import Movie from "../../models/Movie";

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieve a list of all movies.
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal Server Error
 *   post:
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
 */
export default async function handler(req, res) {
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
