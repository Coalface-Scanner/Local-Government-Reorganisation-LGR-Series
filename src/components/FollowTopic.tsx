import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';

interface FollowTopicProps {
  topic: string;
  topicSlug: string;
  className?: string;
}

export default function FollowTopic({ topic, topicSlug, className = '' }: FollowTopicProps) {
  const [isFollowing, setIsFollowing] = useState(() => {
    if (typeof window !== 'undefined') {
      const followed = localStorage.getItem(`followed-topics`);
      if (followed) {
        const topics = JSON.parse(followed);
        return topics.includes(topicSlug);
      }
    }
    return false;
  });

  const handleToggle = () => {
    if (typeof window !== 'undefined') {
      const followed = localStorage.getItem(`followed-topics`);
      let topics: string[] = followed ? JSON.parse(followed) : [];
      
      if (isFollowing) {
        topics = topics.filter(t => t !== topicSlug);
      } else {
        if (!topics.includes(topicSlug)) {
          topics.push(topicSlug);
        }
      }
      
      localStorage.setItem(`followed-topics`, JSON.stringify(topics));
      setIsFollowing(!isFollowing);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`follow-topic-button ${className} ${isFollowing ? 'following' : ''}`}
      aria-label={isFollowing ? `Unfollow ${topic}` : `Follow ${topic}`}
    >
      {isFollowing ? (
        <>
          <BellOff size={16} />
          <span>Following {topic}</span>
        </>
      ) : (
        <>
          <Bell size={16} />
          <span>Follow {topic}</span>
        </>
      )}
    </button>
  );
}
