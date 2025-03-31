
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { getAllUsers, getCurrentUser } from "@/utils/mockData";
import LeaderboardTable from "@/components/LeaderboardTable";

const Leaderboard: React.FC = () => {
  const allUsers = getAllUsers();
  const currentUser = getCurrentUser();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Classifica</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Confronta i tuoi risultati con altri sciatori
          </p>
        </div>

        <div className="bg-gradient-to-r from-snow-500 to-snow-700 text-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">La tua posizione</h2>
              <p className="opacity-90">Stai facendo un ottimo lavoro!</p>
            </div>
            
            <div className="mt-4 md:mt-0 text-center">
              <div className="text-4xl font-bold">#{currentUser.rank}</div>
              <div className="text-sm opacity-80">tra {allUsers.length} sciatori</div>
            </div>
          </div>
        </div>
        
        <LeaderboardTable users={allUsers} currentUserId={currentUser.id} />
      </div>
    </MainLayout>
  );
};

export default Leaderboard;
