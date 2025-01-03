import { z } from "zod";
import { FastifyTypedInstance } from "@/@types/fastify-type";
import { createManga } from "./create-manga.controller";
import { getPaginatedMangas } from "./get-paginated-mangas";
import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { authorizeAdminOnly } from "@/http/middlewares/verify-admin-role";

export async function mangaRoutes(app: FastifyTypedInstance) {
    app.post(
        "/manga",
        {
            onRequest: [verifyJwt, authorizeAdminOnly],
            schema: {
                description: "Create a new manga",
                tags: ["mangas"],
                body: z.object({
                    name: z.string().max(60),
                    url: z.string().url(),
                    date: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])
                }),
                response: {
                    201: z.object({}).describe("Manga created"),
                    400: z
                        .object({
                            message: z.string(),
                            issues: z.array(
                                z.object({
                                    errorCode: z.string(),
                                    field: z.string(),
                                    message: z.string()
                                })
                            )
                        })
                        .describe("Validation errors"),
                    500: z
                        .object({
                            message: z.string()
                        })
                        .describe("Internal Server Error")
                }
            }
        },
        createManga
    );
    app.get(
        "/manga",
        {
            onRequest: [verifyJwt],
            schema: {
                description: "Get Paginated Mangas",
                tags: ["mangas"],
                security: [
                    {
                        BearerAuth: []
                    }
                ],
                querystring: z.object({
                    page: z.string(),
                    offset: z.string()
                }),
                response: {
                    200: z.object({
                        mangas: z
                            .array(
                                z.object({
                                    id: z.string(),
                                    name: z.string(),
                                    date: z.string(),
                                    url: z.string(),
                                    about: z.string().nullable(),
                                    createdAt: z.date(),
                                    updatedAt: z.date()
                                })
                            )
                            .describe("Successfully Get Paginated Mangas")
                    }),
                    400: z
                        .object({
                            message: z.string(),
                            issues: z.array(
                                z.object({
                                    errorCode: z.string(),
                                    field: z.string(),
                                    message: z.string()
                                })
                            )
                        })
                        .describe("Validation errors"),
                    500: z
                        .object({
                            message: z.string()
                        })
                        .describe("Internal Server Error")
                }
            }
        },
        getPaginatedMangas
    );
}
