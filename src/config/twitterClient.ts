import { TwitterApi } from 'twitter-api-v2';

const token = process.env.TWITTER_TOKEN;
const twitterClient = new TwitterApi(token);

const readOnlyClient = twitterClient.readOnly;

export default readOnlyClient;
