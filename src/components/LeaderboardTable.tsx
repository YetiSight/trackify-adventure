
import React from "react";
import { User } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardTableProps {
  users: User[];
  currentUserId?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ users, currentUserId }) => {
  const sortedUsers = [...users].sort((a, b) => (b.totalDistance || 0) - (a.totalDistance || 0));
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-snow-200 dark:border-gray-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">Rank</TableHead>
            <TableHead>Sciatore</TableHead>
            <TableHead className="text-right">Km Totali</TableHead>
            <TableHead className="text-right hidden md:table-cell">Velocità Max</TableHead>
            <TableHead className="text-right hidden md:table-cell">Sessioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user, index) => {
            const isCurrentUser = user.id === currentUserId;
            
            return (
              <TableRow 
                key={user.id}
                className={isCurrentUser ? "bg-snow-50 dark:bg-gray-800/50" : ""}
              >
                <TableCell className="text-center font-medium">
                  {index < 3 ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full">
                      <Award 
                        className={`h-6 w-6 ${
                          index === 0 ? "text-yellow-500" : 
                          index === 1 ? "text-gray-400" : 
                          "text-amber-700"
                        }`} 
                      />
                    </div>
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium flex items-center gap-1">
                      {user.name}
                      {isCurrentUser && (
                        <span className="text-xs bg-snow-100 dark:bg-gray-800 text-snow-800 dark:text-snow-300 py-0.5 px-1.5 rounded ml-1">Tu</span>
                      )}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {user.totalDistance.toFixed(1)} km
                </TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {user.maxSpeed.toFixed(1)} km/h
                </TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {user.totalSessions}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
