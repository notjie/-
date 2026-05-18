<script setup>
const baseUrl = import.meta.env.BASE_URL

const highlights = [
  {
    title: '办学与校训',
    desc: '秉承「德业并进、自强不息」校训精神，坚持立德树人，服务粤港澳大湾区与深圳「双区」建设对高素质技术技能人才的需求。',
  },
  {
    title: '专业与教学',
    desc: '学校设有多个教学单位，建设高水平专业群，覆盖本科与专科层次，注重产教融合、工学结合与创新创业教育。',
  },
  {
    title: '校园与生活',
    desc: '校园分布于西丽、香蜜湖与深汕合作区等地，教学与生活设施完善，图书馆、体育场馆与社团活动丰富多样。',
  },
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-copy">
        <div class="hero-title-row">
          <img
            class="hero-title-emblem"
            :src="`${baseUrl}images/school-emblem.jpg`"
            width="48"
            height="48"
            alt="深圳职业技术大学校徽"
          />
          <div>
            <p class="eyebrow">深圳职业技术大学 · SZPU</p>
            <h1>走进深职大，从这里开始</h1>
          </div>
        </div>
        <p class="lead">
          本站面向新生、访客与校友，提供<strong>校园三维模型浏览</strong>与<strong>全景漫游</strong>入口，帮助您在线了解<strong>深圳职业技术大学</strong>的校园空间与标志性场景。
        </p>
        <div class="cta">
          <router-link to="/model" class="btn primary">查看校园模型</router-link>
          <router-link to="/panorama" class="btn ghost">全景游览</router-link>
        </div>
      </div>
      <aside class="hero-visual" aria-label="学校校徽与校园照片">
        <span class="tag">校园影像</span>
        <img
          class="hero-emblem"
          :src="`${baseUrl}images/school-emblem.jpg`"
          width="120"
          height="120"
          alt="深圳职业技术大学校徽"
        />
        <div class="hero-photo-frame">
          <img
            class="hero-photo"
            :src="`${baseUrl}images/campus-photo.jpg`"
            alt="深圳职业技术大学校园风貌"
          />
        </div>
        <p class="hero-visual-caption">校徽与校园实景</p>
      </aside>
    </section>

    <section class="section">
      <h2>学校简介</h2>
      <p class="prose">
        <strong>深圳职业技术大学</strong>是一所公办本科层次职业大学，前身可追溯至
        1993 年创办的深圳职业技术学院。2023 年，教育部批准以深职院为基础设立深圳职业技术大学，学校立足深圳、服务湾区，致力于培养高层次技术技能人才。
      </p>
      <p class="prose">
        校训为<strong>「德业并进、自强不息」</strong>。学校坚持类型教育定位，深化产教融合、校企合作，在教育教学改革、技能大赛与创新创业等方面形成鲜明特色，被誉为中国高职教育改革发展的一面旗帜。
      </p>
      <p class="prose">
        学校官网：<a href="https://www.szpu.edu.cn/" target="_blank" rel="noopener noreferrer">https://www.szpu.edu.cn/</a>
      </p>
      <p class="prose muted">
        说明：本页文字依据学校官网等公开资料整理，仅用于课程或演示展示；在校生规模、教职工数、专业设置等请以校方最新发布为准。
      </p>
    </section>

    <section class="section">
      <h2>本站功能</h2>
      <div class="grid">
        <article v-for="item in highlights" :key="item.title" class="card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: stretch;
  padding: 2rem 0 0.5rem;
}

@media (max-width: 840px) {
  .hero {
    grid-template-columns: 1fr;
  }
}

.eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b45309;
}

.hero h1 {
  margin: 0 0 1rem;
  font-size: clamp(1.75rem, 4vw, 2.35rem);
  font-weight: 700;
  line-height: 1.2;
}

.hero-title-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 0.5rem;
}

.hero-title-emblem {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 8px;
}

@media (max-width: 480px) {
  .hero-title-row {
    gap: 0.6rem;
  }
  .hero-title-emblem {
    width: 36px;
    height: 36px;
  }
}

.lead {
  margin: 0 0 1.5rem;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text-muted);
}

.lead strong {
  color: var(--text);
  font-weight: 600;
}

.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: transform 0.12s, box-shadow 0.12s;
}

.btn:active {
  transform: scale(0.98);
}

.btn.primary {
  background: linear-gradient(135deg, var(--accent-strong), var(--accent));
  color: var(--on-accent);
  box-shadow: 0 8px 24px rgba(200, 16, 46, 0.28);
}

.btn.primary:hover {
  box-shadow: 0 12px 28px rgba(200, 16, 46, 0.38);
}

.btn.ghost {
  border-color: var(--border);
  color: var(--text);
  background: var(--surface);
}

.btn.ghost:hover {
  border-color: rgba(245, 158, 11, 0.55);
  background: var(--accent-yellow-dim);
}

.hero-visual {
  border-radius: var(--radius);
  background: linear-gradient(180deg, var(--surface) 0%, var(--bg-elevated) 100%);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  min-height: 220px;
  padding: 1.25rem 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
}

.hero-visual .tag {
  align-self: flex-start;
}

.hero-emblem {
  width: 100px;
  height: 100px;
  object-fit: contain;
  flex-shrink: 0;
}

.hero-photo-frame {
  width: 100%;
  flex: 1;
  min-height: 180px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(200, 16, 46, 0.12);
  background: var(--bg);
}

.hero-photo {
  width: 100%;
  height: 100%;
  min-height: 200px;
  max-height: 320px;
  object-fit: cover;
  display: block;
}

.hero-visual-caption {
  margin: 0;
  font-size: 0.82rem;
  color: var(--text-muted);
  text-align: center;
}

.tag {
  align-self: flex-start;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--accent-yellow-dim);
  color: #b45309;
}

.section h2 {
  margin: 0 0 1rem;
  font-size: 1.35rem;
  font-weight: 600;
}

.prose a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose a:hover {
  color: var(--accent-strong);
}

.prose {
  margin: 0 0 0.75rem;
  line-height: 1.8;
  color: var(--text-muted);
  max-width: 72ch;
}

.prose.muted {
  font-size: 0.9rem;
  opacity: 0.9;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  padding: 1.25rem 1.35rem;
  border-radius: var(--radius);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
}

.card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 600;
}

.card p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--text-muted);
}
</style>
