import React from 'react';
import {useState} from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Link from 'next/link'; 
import Paginate from 'react-paginate';

interface Urls {
  pc: string;
}

interface Photo {
  pc: {
    m: string;
  };
}

interface Shop {
  id: string;
  name: string;
  urls: Urls;
  photo: Photo;
  catch: string;
  address: string;
  open: string;
  access: string;
}

interface Results {
  results_available: number;
  shop: Shop[];
}

interface HomeProps {
  results: Results;
  lat: number;
  lng: number;
  range: number;
}

const SearchPage = ({ results, lat, lng, range }: HomeProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const itemsPerPage = 10;
  const data = results.shop;

  const handlePageClick = ({ selected: selectedPage }: { selected: number }) => {
    setCurrentPage(selectedPage + 1 );
    router.push({
      pathname: '/search',
      query: { 
        latitude: lat,
        longitude: lng,
        range: range,
        page: selectedPage + 1 }, 
    });
  };

  // ページネーションコントロール
  const pageCount = Math.ceil(results.results_available / itemsPerPage);

    return (
      <div>
        <main className="flex flex-col flex-grow bg-white text-black">
          <div className="max-w-[1000px] mt-[80px] mb-[100px] mx-auto">
            <p>{results.results_available}件 ( {currentPage} / {pageCount}ページ )</p>
            <ul>
                {results.shop.map((data) => {
                    return (
                      <div className='rounded-xl card card-side bg-base-100 shadow-xl p-8 border bg-amber-50 border-green-600 my-4'>
                        <div className=''>
                          <li key={data.id} className="flex">
                            <div className="card card-side min-w-fit min-h-fit max-w-fit max-h-fit">
                              <Image
                                src={data.photo.pc.m}
                                alt={data.name}
                                width={168}
                                height={168}
                                className="object-cover"
                              />
                            </div>
                            <div className="card-body flex-grow p-2">
                              <div>{data.catch}</div>
                              <h3 className="text-xl">
                                <Link href={`/${data.id}`}>
                                  {data.name}
                                </Link>
                              </h3>
                              <div>営業時間：{data.open}</div>
                              <div>アクセス：{data.access}</div>
                            </div>
                          </li>
                        </div>
                      </div>
                    );
                })}
                <Paginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  previousLinkClassName={"pagination__link"}
                  nextLinkClassName={"pagination__link"}
                  disabledClassName={"pagination__link--disabled"}
                  activeClassName={"pagination__link--active"}
                />
            </ul>
          </div>
            
        </main>
        <footer className="text-white footer p-4 bg-green-700 text-base-content text-center">
          Powered by <a className="text-blue-200" href="http://webservice.recruit.co.jp/">ホットペッパーグルメ Webサービス</a>
        </footer>
      </div>  
    );
}

export default SearchPage;

// リクエストごとに呼び出されます。
export async function getServerSideProps(context: any) {
  const apiKey = process.env.API_KEY;
  const page = context.query.page;
  const baseUrl = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
  const lat = context.query.latitude;
  const lng = context.query.longitude;
  // const lat = "35.6905";
  // const lng = "139.6995";
  const range = context.query.range;
  const start = (page * 10) - 9;
  const format = "json";

  // 外部APIからデータをFetchします。
  const res = await fetch(
    `${baseUrl}?key=${apiKey}&lat=${lat}&lng=${lng}&range=${range}&start=${start}&format=${format}`
  );
  const json = await res.json();
  const { results } = json;

  return { props: { results, lat, lng, range } };
}