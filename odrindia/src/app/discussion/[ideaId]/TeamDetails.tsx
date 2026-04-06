import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { apiFetch } from '@/lib/api';
import { Loader2, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    image: string;
    description: string;
    role: 'owner' | 'mentor' | 'collaborator';
}

interface TeamDetailsProps {
    ideaId: string;
}

interface TeamData {
    owner: TeamMember;
    mentor?: TeamMember;
    collaborators: TeamMember[];
}

const RoleBadge = ({ role }: { role: string }) => {
    const badgeStyles = {
        owner: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none',
        mentor: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none',
        collaborator: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-none',
    };

    return (
        <Badge className={`${badgeStyles[role as keyof typeof badgeStyles]} shadow-sm px-3 py-1`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
    );
};

const MemberCard = ({ member }: { member: TeamMember }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ 
            scale: 1.02,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
        className="flex items-start gap-3 p-3 sm:p-4 rounded-lg mb-3 bg-white border border-blue-100 transition-all duration-300 overflow-hidden"
    >
        <div className="relative flex-shrink-0 flex-col">
        <div className="flex items-center justify-center">
            <Avatar className="h-12 w-12 border-2 border-blue-200">
                <AvatarImage 
                    src={member.image || '/placeholder-avatar.png'} 
                    alt={`${member.name}'s profile`} 
                />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                    {member.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        </div>
            <div className="bg-white rounded-full p-0.5">
                <RoleBadge role={member.role} />
            </div>
        </div>
        <div className="flex-1 ml-2">
            <h3 className="font-semibold text-lg text-gray-800 mb-1">{member.name}</h3>
            <p className="text-sm text-blue-600 mb-2">{member.email}</p>
            <p className="text-sm text-gray-600 italic">{member.description}</p>
        </div>
    </motion.div>
);

const TeamDetails: React.FC<TeamDetailsProps> = ({ ideaId }) => {
    const [team, setTeam] = useState<TeamData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeamDetails = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await apiFetch(`/ideas/${ideaId}/team`, {
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch team details');
                }
                
                const data = await response.json();
                setTeam(data);
            } catch (err) {
                console.error('Error fetching team details:', err);
                setError('Unable to load team details');
            } finally {
                setLoading(false);
            }
        };
        
        fetchTeamDetails();
    }, [ideaId]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-60 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-3" />
                <span className="text-blue-700 font-medium">Loading team details...</span>
            </div>
        );
    }
    
    if (error) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 bg-red-50 border border-red-200 rounded-lg text-red-700 flex flex-col items-center"
            >
                <div className="mb-3 text-red-500 bg-red-100 p-3 rounded-full">
                    <Users className="h-6 w-6" />
                </div>
                <p className="text-center mb-3">{error}</p>
                <button 
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300" 
                    onClick={() => window.location.reload()}
                >
                    Try again
                </button>
            </motion.div>
        );
    }
    
    if (!team) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-8 bg-blue-50 rounded-lg border border-blue-100"
            >
                <div className="mx-auto mb-4 bg-blue-100 text-blue-500 p-3 inline-block rounded-full">
                    <Users className="h-8 w-8" />
                </div>
                <p className="text-blue-700">No team information available</p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100 shadow-sm overflow-hidden"
        >
            <div className="space-y-3">
                <div className="mb-3">
                    <h4 className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-2 text-center">Project Owner</h4>
                    <MemberCard member={team.owner} />
                </div>
                
                {team.mentor && (
                    <div className="mb-3">
                        <h4 className="text-xs uppercase tracking-wider text-purple-600 font-semibold mb-2 text-center">Mentor</h4>
                        <MemberCard member={team.mentor} />
                    </div>
                )}
                
                {team.collaborators.length > 0 && (
                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-green-600 font-semibold mb-2 text-center">Collaborators</h4>
                        <div className="space-y-2">
                            {team.collaborators.map((collaborator) => (
                                <MemberCard key={collaborator.id} member={collaborator} />
                            ))}
                        </div>
                    </div>
                )}
                
                {team.collaborators.length === 0 && (
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                    >
                        <p className="text-blue-700 font-medium">No collaborators yet</p>
                        <p className="text-xs text-blue-600 mt-1">Team members will appear here once added</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default TeamDetails;