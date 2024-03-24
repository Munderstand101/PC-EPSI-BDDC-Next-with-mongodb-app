// pages/api/movie/[idMovie].js
import { findOneDocument, updateDocument, deleteDocument, ObjectId } from "../../../servicies/mongodbService";
import NextCors from 'nextjs-cors';

/**
 * @swagger
 * /api/movie/{idMovie}:
 *   get:
 *     tags:
 *        - Movies
 *     summary: Get movie by ID
 *     description: Get a movie by its ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         description: ID of the movie to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     tags:
 *        - Movies
 *     summary: Update movie by ID
 *     description: Update a movie by its ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         description: ID of the movie to update
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         required: true
 *         description: Updated movie object
 *         schema:
 *           type: object
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     tags:
 *        - Movies
 *     summary: Delete movie by ID
 *     description: Delete a movie by its ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         description: ID of the movie to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
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

    await NextCors(req, res, {
        methods: ['GET', 'PUT', 'DELETE'], // Specify the methods allowed
        origin: '*', // Adjust according to your needs, '*' allows all origins
        optionsSuccessStatus: 200,
    });

    const { idMovie } = req.query;

    switch (req.method) {
        case "GET":
            try {
                const movie = await findOneDocument("movies", { _id: ObjectId(idMovie) });
                if (!movie) {
                    return res.status(404).json({ error: "Movie not found" });
                }
                return res.status(200).json({ status: 200, data: movie });
            } catch (error) {
                console.error("Error fetching movie:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

        case "PUT":
            try {
                const existingMovie = await findOneDocument("movies", { _id: ObjectId(idMovie) });

                if (!existingMovie) {
                    return res.status(404).json({ error: "Movie not found" });
                }

                const updatedMovieData = req.body;

                await updateDocument("movies", { _id: ObjectId(idMovie) }, {
                    $set: updatedMovieData,
                });

                console.log("Movie Updated Successfully");
                return res.status(200).json({ status: 200, message: "Movie updated successfully" });
            } catch (error) {
                console.error("Error updating movie:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

        case "DELETE":
            try {
                await deleteDocument("movies", { _id: ObjectId(idMovie) });
                return res.status(200).json({ status: 200, message: "Movie deleted successfully" });
            } catch (error) {
                console.error("Error deleting movie:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
