import Constants from 'expo-constants';

const ENV = Constants.manifest?.releaseChannel === 'production' ? 'prod' : 'dev';

const dev = {
  BACKEND_URL: 'http://192.168.1.18:8000/api',
};

const prod = {
  BACKEND_URL: 'https://prod.example.com/api',
};

const Config = ENV === 'prod' ? prod : dev;

export default Config;
