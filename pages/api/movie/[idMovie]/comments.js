// pages/api/movie/[idMovie]/comments.js
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import NextCors from 'nextjs-cors';

/**
 * @swagger
 * /api/movie/{idMovie}/comments:
 *   get:
 *     tags:
 *        - Comments
 *     summary: Get comments for a movie
 *     description: Retrieve all comments associated with a specific movie.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         description: ID of the movie to retrieve comments for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Comments not found
 *       500:
 *         description: Internal Server Error
 *   post:
 *     tags:
 *       - Comments
 *     summary: Add a new comment for a specific movie
 *     description: Add a new comment for a specific movie using the provided data.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         description: ID of the movie to add the comment to
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Comment object to add
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Bad Request. Missing required fields.
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

    // Initialize the cors middleware
    await NextCors(req, res, {
        methods: ['GET', 'POST'], // Specify the methods allowed
        origin: '*', // Adjust according to your needs, '*' allows all origins
        optionsSuccessStatus: 200,
    });


    const { idMovie } = req.query;
    console.log("ID Movie:", idMovie); // Log idMovie for debugging
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    switch (req.method) {
        case "GET":
            try {
                const comments = await db.collection("comments").find({ movie_id: ObjectId(idMovie) }).toArray();
                if (!comments) {
                    return res.status(404).json({ error: "Comments not found" });
                }
                return res.status(200).json({ status: 200, data: comments });
            } catch (error) {
                console.error("Error fetching movie:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

        case "POST":
            try {
                const { idMovie, idComment } = req.query;

                // Check if idMovie and idComment are provided in the request
                if (!idMovie || !idComment) {
                    return res.status(400).json({ error: "Bad Request. Missing idMovie or idComment." });
                }

                // Validate the comment data using a Comment model (if available)
                const commentData = new Comment(req.body);

                // Ensure that required fields are present in the request
                if (!Comment.validateRequiredFields(commentData)) {
                    return res.status(400).json({ error: "Bad Request. Missing required fields." });
                }

                // Log the request payload for debugging
                // console.log("Request Payload:", req.body);

                // Return a success response
                return res.status(200).json({ status: 200, message: "Comment added successfully" });
            } catch (error) {
                console.error("Error adding comment:", error);
                return res.status(500).json({ error: "Internal Server Error", details: error.message });
            }

        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
