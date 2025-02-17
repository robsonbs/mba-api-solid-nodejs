import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page?: number
}
interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}
export class FetchUserCheckInsHistoryUseCase {
  constructor(private readonly checkInRepository: CheckInsRepository) {}
  async execute({
    userId,
    page = 1,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(userId, page)
    return { checkIns }
  }
}
