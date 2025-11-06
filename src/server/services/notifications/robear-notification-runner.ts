import publicData from "~/app/harta/public-data.json";
import { BearAlertNotificationService } from "~/server/services/notifications/bear-alert-notification.service";

const BEAR_KEYWORDS = ["bear", "urs"];

const notificationService = new BearAlertNotificationService();

type PublicBearPoint = (typeof publicData.mappedData)[number];

export async function dispatchRobearNotifications(options?: { force?: boolean }) {
  const points: PublicBearPoint[] = Array.isArray(publicData.mappedData)
    ? (publicData.mappedData as PublicBearPoint[])
    : [];

  const notifications = [] as Array<
    Awaited<ReturnType<typeof notificationService.notify>>
  >;

  for (const point of points) {
    const type = (point.type ?? "").toLowerCase();
    const matchesBear = BEAR_KEYWORDS.some((keyword) => type.includes(keyword));

    if (!matchesBear) {
      continue;
    }

    notifications.push(
      await notificationService.notify(
        {
          id: `robear-${point.id}`,
          latitude: point.latitude,
          longitude: point.longitude,
          description: point.description ?? null,
          occurredAt: point.posted ?? point.date ?? null,
          accuracy: "Precizie aproximativa (+/- 250 m)",
          validationTier: "Tier 1",
          provider: "RO-bear",
        },
        options,
      ),
    );
  }

  return notifications;
}
