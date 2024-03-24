// pages/api/movies/[idMovie]/comments/[idComment].js
import { ObjectId } from "mongodb";
import clientPromise from "../../../../../lib/mongodb";
import {findOneDocument} from "../../../../../servicies/mongodbService";
import NextCors from 'nextjs-cors';

/**
 * @swagger
 * /api/movie/{idMovie}/comments/{idComment}:
 *   get:
 *     tags:
 *        - Comments
 *     summary: Get a comment by ID for a specific movie
 *     description: Retrieve a specific comment by its ID for a given movie.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         description: ID of the movie associated with the comment
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idComment
 *         description: ID of the comment to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     tags:
 *        - Comments
 *     summary: Update a comment for a specific movie
 *     description: Update a comment for a specific movie using the provided data.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         description: ID of the movie associated with the comment
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idComment
 *         description: ID of the comment to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated comment object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       404:
 *         description: Comment not found or not updated
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     tags:
 *        - Comments
 *     summary: Delete a comment for a specific movie
 *     description: Delete a comment for a specific movie by its ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         description: ID of the movie associated with the comment
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idComment
 *         description: ID of the comment to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 *
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         text:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         movie_id:
 *           type: string
 *       required:
 *         - name
 *         - email
 *         - text
 *         - date
 *         - movie_id
 */
export default async function handler(req, res) {

    await NextCors(req, res, {
        methods: ['GET', 'PUT', 'DELETE'], // Specify the methods allowed
        origin: '*', // Adjust according to your needs, '*' allows all origins
        optionsSuccessStatus: 200,
    });

    const { idMovie, idComment } = req.query;
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    switch (req.method) {
        case "GET":
            // GET /api/movies/:idMovie/comments/:idComment
            const comment = await db.collection("comments").findOne({ _id: ObjectId(idComment), movie_id: ObjectId(idMovie) });
            return comment
                ? res.status(200).json({ status: 200, data: comment })
                : res.status(404).json({ error: "Comment not found" });
        case "PUT":
            try {
                // Update the comment with idComment for the movie with idMovie
                const result = await db.collection("comments").updateOne(
                    { _id: ObjectId(idComment), movie_id: ObjectId(idMovie) },
                    { $set: req.body }
                );

                // Check if the update operation was successful
                if (result.modifiedCount === 1) {
                    console.log("Comment updated successfully");
                    return res.status(200).json({ status: 200, message: "Comment updated successfully" });
                } else {
                    console.log("Comment not found or not updated");
                    return res.status(404).json({ error: "Comment not found or not updated" });
                }
            } catch (error) {
                console.error("Error updating comment:", error);
                return res.status(500).json({ error: "Internal Server Error", details: error.message });
            }
        case "DELETE":
            try {
                // Check if the comment exists before attempting deletion
                const comment = await findOneDocument("comments", { _id: ObjectId(idComment), movie_id: ObjectId(idMovie) });

                if (!comment) {
                    console.log("Comment not found");
                    return res.status(404).json({ error: "Comment not found" });
                }

                // If the comment exists, proceed with deletion
                const result = await db.collection("comments").deleteOne({ _id: ObjectId(idComment), movie_id: ObjectId(idMovie) });

                if (result.deletedCount === 1) {
                    console.log("Comment deleted successfully");
                    return res.status(200).json({ status: 200, message: "Comment deleted successfully" });
                } else if (result.deletedCount === 0) {
                    console.log("No comment was deleted");
                    return res.status(404).json({ error: "No comment was deleted" });
                } else {
                    console.log("Unexpected result: deletedCount =", result.deletedCount);
                    return res.status(500).json({ error: "Internal Server Error", details: "Unexpected result" });
                }
            } catch (error) {
                console.error("Error deleting comment:", error);
                return res.status(500).json({ error: "Internal Server Error", details: error.message });
            }

        default:

            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
