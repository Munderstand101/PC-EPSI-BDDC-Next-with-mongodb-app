// pages/api/movie/[idMovie].js
import { findOneDocument, updateDocument, deleteDocument, ObjectId } from "../../../servicies/mongodbService";


/**
 * @swagger
 * /api/movie/{idMovie}:
 *   get:
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
 *             $ref: '#/components/schemas/MovieDetail'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 *   delete:
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
 */

export default async function handler(req, res) {
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
