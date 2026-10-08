const API_BASE = '/api';

export async function fetchPapers(params = {}) {
  const query = new URLSearchParams();
  if (params.course) query.append('course', params.course);
  if (params.year) query.append('year', params.year);
  if (params.exam_type) query.append('exam_type', params.exam_type);
  if (params.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/papers?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch question papers.');
  return await res.json();
}

export async function fetchPaperById(id) {
  const res = await fetch(`${API_BASE}/papers/${id}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch paper details.');
  }
  return await res.json();
}

export async function checkDuplicatePaper(course, year, examType) {
  const query = new URLSearchParams({
    course,
    year: year.toString(),
    exam_type: examType
  });
  const res = await fetch(`${API_BASE}/papers/check-duplicate?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to check duplicate paper status.');
  return await res.json();
}

export async function uploadPaperApi(formData) {
  const res = await fetch(`${API_BASE}/papers`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload question paper.');
  }
  return data;
}

export async function fetchSolutionsApi(paperId) {
  const res = await fetch(`${API_BASE}/papers/${paperId}/solutions`);
  if (!res.ok) throw new Error('Failed to fetch paper solutions.');
  return await res.json();
}

export async function uploadSolutionApi(paperId, formData) {
  const res = await fetch(`${API_BASE}/papers/${paperId}/solutions`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload solution.');
  }
  return data;
}

export async function fetchMetaOptionsApi() {
  const res = await fetch(`${API_BASE}/papers/meta-options`);
  if (!res.ok) throw new Error('Failed to fetch metadata options.');
  return await res.json();
}

export function getPaperDownloadUrl(paperId) {
  return `${API_BASE}/papers/${paperId}/download`;
}

export function getSolutionDownloadUrl(solutionId) {
  return `${API_BASE}/solutions/${solutionId}/download`;
}

export async function deletePaperApi(paperId) {
  const res = await fetch(`${API_BASE}/papers/${paperId}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete question paper.');
  }
  return data;
}
