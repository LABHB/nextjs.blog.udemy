import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";


const postsDirectory = path.join(process.cwd(), "posts");

export function getPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName)=>{
    const id = fileName.replace(/\.md$/, "");//ファイル名
    
    //マークダウンファイルを文字列とsて読み取る
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath,"utf8");
    const matterResult = matter(fileContents);

    //idとデータ返す
    return {
      id,
      ...matterResult.data,
    };
  });
  return allPostsData;
}

//動的ルーティング時に設定
//postsディレクトリの中の全てのファイル名をリストで返す
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  // 以下のような配列を返します:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      //あとで、これら(id)がルーティングのパスになる。
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

//idに基づいてブログの投稿データを返す
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // 投稿のメタデータ部分を解析するために gray-matter を使う
  const matterResult = matter(fileContents);
  // console.log(matterResult);

  // マークダウンをHTML文字列に変換するためにremarkを使う
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const ContentHTML = processedContent.toString();
  // console.log(contentHTML);

  //データをidと組み合わせる。
  return {
    id,
    ContentHTML, //あとで追加
    ...matterResult.data,
  };
}
