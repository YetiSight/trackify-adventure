
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { getCurrentUser, getUserSessions, calculateTotalStats } from "@/utils/mockData";
import UserStatsCard from "@/components/UserStatsCard";
import UserSessionsList from "@/components/UserSessionsList";
import NotificationsCard from "@/components/NotificationsCard";
import { getNotifications } from "@/utils/mockData";

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();
  const userSessions = getUserSessions(currentUser.id);
  const notifications = getNotifications();
  
  const totalStats = calculateTotalStats(userSessions);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profilo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Le tue statistiche e sessioni di sci
          </p>
        </div>
        
        <UserStatsCard user={currentUser} totalTime={totalStats.totalTime} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserSessionsList sessions={userSessions} />
          </div>
          
          <div>
            <NotificationsCard notifications={notifications} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
