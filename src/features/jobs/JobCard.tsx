import { Link } from "react-router-dom";


export type Job = {
  id: string;
  title: string;
  companyName: string;
  location: string;
  postedAt?: string;
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <article >
      <h3 >
        <Link to={`/jobs/${job.id}`} >{job.title}</Link>
      </h3>
      <div >{job.companyName} • {job.location}</div>
      {job.postedAt && <div >게시: {job.postedAt}</div>}
    </article>
  );
}
