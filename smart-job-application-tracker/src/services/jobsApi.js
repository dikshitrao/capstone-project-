const RAPID_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPID_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'jsearch.p.rapidapi.com';

function normalizeJSearch(job) {
  return {
    id: job.job_id,
    title: job.job_title,
    company: job.employer_name,
    location: job.job_city || job.job_country || 'Remote / Not listed',
    url: job.job_apply_link,
    source: 'JSearch',
  };
}

function normalizeArbeitnow(job) {
  return {
    id: job.slug,
    title: job.title,
    company: job.company_name,
    location: job.location || 'Remote / Not listed',
    url: job.url,
    source: 'Arbeitnow',
  };
}

export async function fetchJobs(query = 'frontend intern') {
  if (RAPID_KEY) {
    const response = await fetch(`https://${RAPID_HOST}/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`, {
      headers: {
        'X-RapidAPI-Key': RAPID_KEY,
        'X-RapidAPI-Host': RAPID_HOST,
      },
    });

    if (!response.ok) {
      throw new Error('Job API request failed. Please check the API key or try again later.');
    }

    const data = await response.json();
    return (data.data || []).slice(0, 8).map(normalizeJSearch);
  }

  const response = await fetch('https://www.arbeitnow.com/api/job-board-api');
  if (!response.ok) {
    throw new Error('Unable to fetch live job listings right now.');
  }

  const data = await response.json();
  const normalizedQuery = query.toLowerCase();
  return (data.data || [])
    .filter((job) => `${job.title} ${job.company_name} ${job.location}`.toLowerCase().includes(normalizedQuery.split(' ')[0]))
    .slice(0, 8)
    .map(normalizeArbeitnow);
}
