import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
// import { StatsCard } from "@/components/admin/dashboard/DashboardAdminClient/StatsCard"
// import { TransactionsTable } from "@/components/admin/dashboard/DashboardAdminClient/TransactionsTable"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Unworthy from "@/components/common/unworthy";
import Announcements from "@/components/admin/dashboard/Announcements";
import AttendanceChart from "@/components/admin/dashboard/AttendanceChart";
import CountChart from "@/components/admin/dashboard/CountChart";
import EventCalendar from "@/components/admin/dashboard/EventCalendar";
import FinanceChart from "@/components/admin/dashboard/FinanceChart";
import UserCard from "@/components/admin/dashboard/UserCard";

export const metadata: Metadata = {
  title: "Dashboard | Mahinda Rajapaksa College LMS",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return <Unworthy />;

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}
