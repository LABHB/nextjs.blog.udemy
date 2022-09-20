import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Layout, { siteTitle } from './components/Layout'
import utilStyle from "../styles/utils.module.css"

import {getPostsData} from "../lib/post";

//SSGの場合
export async function getStaticProps() {
  const allPostsData = getPostsData(); // id,title,date,thumbnail
  return {
    props:{
      allPostsData,
    },
  };
}

export default function Home( {allPostsData} ) {
  return (
    <Layout home>
      <Head>
        <title>
          {siteTitle}
        </title>
      </Head>
      <section className={utilStyle.headingMd}>
        <p>NEXTgit エンジニアになれるように修行中</p>
      </section>
      <section>
        <div>
          <h2>📝エンジニアのブログ</h2>
          <articles  className={styles.grid} >
            {allPostsData.map(({id, title, date, thumbnail}) => (
                          <article key={id}>
                          <Link href={`/posts/${id}`}>
                          <img
                            src={thumbnail}
                            className={styles.thumbnailImage} />
                          </Link>
                          <Link href={`/posts/${id}`}>
                            <a className={utilStyle.boldText} >{title}</a>
                          </Link>
                          <br />
                          <small className={utilStyle.lightText}>
                            {date}
                          </small>
                        </article>
            ))}
          </articles>
        </div>
      </section>
      
    </Layout>
  )
}
