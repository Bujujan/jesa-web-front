import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PunchStats = {
  totalPunches: number;
  newThisMonth: number;
  resolved: number;
  pending: number;
  trend: {
    total: number;
    new: number;
    resolved: number;
    pending: number;
  };
};

function renderStatValue(value: number | undefined | null) {
  return value != null ? (
    value
  ) : (
    <span className="text-xl">No stats available</span>
  );
}

export function SectionCards({
  punchStats,
}: {
  punchStats: PunchStats | null;
}) {
  return (
    <div className="flex flex-row gap-4 p-2 lg:px-6 w-full overflow-x-auto">
      {/* Total Punches */}
      <Card className="w-full">
        <CardHeader>
          <CardDescription>Total Punches</CardDescription>
          <CardTitle className="text-3xl">
            {renderStatValue(punchStats?.totalPunches)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />+{punchStats?.trend?.total ?? 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <span className="text-muted-foreground">All recorded punches</span>
        </CardFooter>
      </Card>

      {/* New This Month */}
      <Card className="w-full">
        <CardHeader>
          <CardDescription>New This Month</CardDescription>
          <CardTitle className="text-3xl">
            {renderStatValue(punchStats?.newThisMonth)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />+{punchStats?.trend?.new ?? 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <span className="text-muted-foreground">Recent entries</span>
        </CardFooter>
      </Card>

      {/* Resolved */}
      <Card className="w-full">
        <CardHeader>
          <CardDescription>Resolved Punches</CardDescription>
          <CardTitle className="text-3xl">
            {renderStatValue(punchStats?.resolved)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />+{punchStats?.trend?.resolved ?? 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <span className="text-muted-foreground">Successfully resolved</span>
        </CardFooter>
      </Card>

      {/* Pending */}
      <Card className="w-full">
        <CardHeader>
          <CardDescription>Pending Punches</CardDescription>
          <CardTitle className="text-3xl">
            {renderStatValue(punchStats?.pending)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />-{punchStats?.trend?.pending ?? 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <span className="text-muted-foreground">
            Still open or in progress
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
