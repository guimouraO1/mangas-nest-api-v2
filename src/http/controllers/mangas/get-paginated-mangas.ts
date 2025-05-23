import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetPaginatedMangasUseCase } from '../../../use-cases/_factories/make-get-paginated-mangas';
import { GetPaginatedMangas } from '../../../utils/validators/mangas/get-manga-schema';

export async function getPaginatedMangas(request: FastifyRequest, reply: FastifyReply) {
    const { page, offset } = request.query as GetPaginatedMangas;
    try {
        const getMangaUseCase = makeGetPaginatedMangasUseCase();
        const mangas = await getMangaUseCase.execute({ page: +page, offset: +offset, userId: request.user.sub });
        return reply.status(200).send(mangas);
    } catch (error) {
        throw new Error('');
    }
}
