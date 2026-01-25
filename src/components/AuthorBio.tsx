
interface AuthorBioProps {
  name: string;
  affiliation?: string;
  credentials?: string;
  bio?: string;
  imageUrl?: string;
  className?: string;
}

export default function AuthorBio({ 
  name, 
  affiliation, 
  credentials, 
  bio, 
  imageUrl,
  className = '' 
}: AuthorBioProps) {
  return (
    <div className={`author-bio ${className}`}>
      {imageUrl && (
        <div className="author-bio-image">
          <img src={imageUrl} alt={name} />
        </div>
      )}
      <div className="author-bio-content">
        <h3 className="author-bio-name">{name}</h3>
        {(affiliation || credentials) && (
          <div className="author-bio-meta">
            {affiliation && <span className="author-bio-affiliation">{affiliation}</span>}
            {credentials && <span className="author-bio-credentials">{credentials}</span>}
          </div>
        )}
        {bio && (
          <p className="author-bio-text">{bio}</p>
        )}
      </div>
    </div>
  );
}
