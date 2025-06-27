const esbuild = require('esbuild');

const build = async () => {
  await esbuild.build({
    entryPoints: ['netlify/functions/products.js', 'netlify/functions/categories.js', 'netlify/functions/auth.js'],
    outdir: 'netlify/functions/dist',
    platform: 'node',
    target: 'node18',
    bundle: true,
    minify: true,
    define: {
      'process.env.MONGO_URI': JSON.stringify(process.env.MONGO_URI),
      'process.env.JWT_SECRET': JSON.stringify(process.env.JWT_SECRET)
    }
  });
};

build();
