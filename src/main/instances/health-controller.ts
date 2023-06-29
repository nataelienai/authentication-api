import { HealthController } from '@/presentation/controllers/health-controller';

export function getHealthController() {
  return new HealthController();
}
