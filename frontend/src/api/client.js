const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const request = async (path, options = {}) => {
  const { skipAuth, ...rest } = options;
  const finalOptions = {
    ...rest,
    headers: {
      ...(rest.headers || {}),
    },
  };

  const hasBody = finalOptions.body !== undefined && finalOptions.body !== null;
  if (hasBody && !(finalOptions.body instanceof FormData)) {
    if (!finalOptions.headers['Content-Type']) {
      finalOptions.headers['Content-Type'] = 'application/json';
    }
    if (typeof finalOptions.body !== 'string') {
      finalOptions.body = JSON.stringify(finalOptions.body);
    }
  }

  if (!skipAuth && authToken) {
    finalOptions.headers.Authorization = `Bearer ${authToken}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, finalOptions);
  } catch (error) {
    throw new Error(`Failed to reach API at ${API_BASE_URL}.`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.detail || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

export const apiLogin = (payload) =>
  request('/auth/login', {
    method: 'POST',
    body: payload,
  });

export const apiGetMe = () => request('/me');

export const apiListPipelines = (query) => {
  const suffix = query ? `?q=${encodeURIComponent(query)}` : '';
  return request(`/pipelines${suffix}`);
};

export const apiCreatePipeline = (payload) =>
  request('/pipelines', {
    method: 'POST',
    body: payload,
  });

export const apiGetPipeline = (pipelineId) => request(`/pipelines/${pipelineId}`);

export const apiUpdatePipeline = (pipelineId, payload) =>
  request(`/pipelines/${pipelineId}`, {
    method: 'PUT',
    body: payload,
  });

export const apiDeletePipeline = (pipelineId) =>
  request(`/pipelines/${pipelineId}`, {
    method: 'DELETE',
  });

export const apiValidatePipeline = (nodes, edges) =>
  request('/pipelines/parse', {
    method: 'POST',
    body: { nodes, edges },
  });

export const apiGetRuns = (pipelineId) =>
  request(`/pipelines/${pipelineId}/runs`);

export const apiRunPipeline = (pipelineId) =>
  request(`/pipelines/${pipelineId}/runs`, {
    method: 'POST',
    body: {},
  });

export const apiCreateShare = (pipelineId) =>
  request(`/pipelines/${pipelineId}/share`, {
    method: 'POST',
    body: {},
  });

export const apiGetSharedPipeline = (token) =>
  request(`/share/${token}`, { skipAuth: true });
