/**
 * 建筑配置数据：模型文件路径、热点位置、详细信息
 * 整合自 laihanghong 项目的热点信息
 */
export const buildings = [
  {
    name: '厚德楼',
    file: 'models/厚德楼.glb',
    hotspot: {
      position: [-20, 30, 15],
      info: '行政楼',
      details: [
        '建筑面积：7500平方米',
        '层数：5层',
        '功能：教师办公室、会议室',
        '学院分区：人工智能学院（304/320/321）',
      ],
    },
  },
  {
    name: '均园餐厅',
    file: 'models/均园餐厅.glb',
    hotspot: {
      position: [15, 28, 20],
      info: '学生食堂',
      details: [
        '建筑面积：3500平方米',
        '层数：3层',
        '档口数量：45个',
        '可同时容纳1200人就餐',
      ],
    },
  },
  {
    name: '信息楼',
    file: 'models/信息楼.glb',
    hotspot: {
      position: [25, 35, 5],
      info: '人工智能学院',
      details: [
        '建筑面积：3000平方米',
        '实验室：云计算、人工智能、网络安全',
        '设备总值：6000万元',
        '限时开放自习教室',
      ],
    },
  },
  {
    name: '图书馆',
    file: 'models/图书馆.glb',
    hotspot: {
      position: [10, 60, 15],
      info: '校图书馆分馆',
      details: [
        '建筑面积：4500平方米',
        '藏书量：120万册纸质图书',
        '电子资源：50TB数据库',
        '阅览座位：1000个',
      ],
    },
  },
  {
    name: '日新楼',
    file: 'models/日新楼.glb',
    hotspot: {
      position: [15, 35, 20],
      info: '教学楼',
      details: [
        '建筑面积：4000平方米',
        '层数：6层',
        '功能：日常教学、多媒体教室',
        '配备智慧教室系统',
      ],
    },
  },
  {
    name: '格物园A',
    file: 'models/格物园A.glb',
    hotspot: {
      position: [30, 40, 25],
      info: '理工实验楼',
      details: [
        '建筑面积：5000平方米',
        '主要功能：物理、汽车基础实验',
        '精密仪器室：12间',
        '安全等级：二级生物安全实验室',
      ],
    },
  },
  {
    name: '格物园B',
    file: 'models/格物园B.glb',
    hotspot: {
      position: [20, 40, 30],
      info: '理工实验楼',
      details: [
        '建筑面积：2500平方米',
        '主要功能：物理、汽车基础实验',
        '精密仪器室：12间',
        '安全等级：二级生物安全实验室',
      ],
    },
  },
]