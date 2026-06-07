import app from './app.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('  味道轩餐饮智能平台 - 后端服务');
  console.log('========================================');
  console.log(`  服务地址: http://localhost:${PORT}`);
  console.log(`  健康检查: http://localhost:${PORT}/api/health`);
  console.log(`  启动时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log('========================================');
  console.log('');
});

process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n收到 SIGINT 信号，正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

export default server;
