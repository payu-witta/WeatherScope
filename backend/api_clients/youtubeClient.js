const axios = require('axios');

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

async function searchVideos(location, maxResults = 4) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const response = await axios.get(YOUTUBE_SEARCH_URL, {
    params: {
      part: 'snippet',
      q: `${location} travel weather`,
      type: 'video',
      maxResults,
      key: apiKey,
      relevanceLanguage: 'en',
      safeSearch: 'strict',
      videoEmbeddable: true
    }
  });

  return response.data.items.map(item => ({
    video_id: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.medium.url,
    published: item.snippet.publishedAt,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    embed_url: `https://www.youtube.com/embed/${item.id.videoId}`
  }));
}

module.exports = { searchVideos };
