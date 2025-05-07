'use client';

import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

import { PAGE_LMIT } from '@/utils/constant';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalArticles, setTotalArticles] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  const getArticles = async () => {
    try {
      const res = await fetch(`${window.origin}/api/news`);
      const data = await res.json();

      setTotalArticles(data.Data || []);
    } catch (e) {
      console.error('Error in get articles', e);
    }
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    getArticles();
  }, []);

  useEffect(() => {
    const startOffset = currentPage * PAGE_LMIT;
    const endOffset = startOffset + PAGE_LMIT;
    setArticles(totalArticles.slice(startOffset, endOffset));
  }, [currentPage, totalArticles]);

  const pageCount = Math.ceil(totalArticles.length / PAGE_LMIT);

  return (
    <main>
      <div className="relative w-full h-[500px] bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05')]">
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">News</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {articles.map((atcl, index) => (
          <article key={index} className={`mb-12 ${index !== articles.length - 1 ? 'pb-12 border-b border-gray-200' : ''}`}>
            <div className='flex flex-col md:flex-row gap-4'>
              <img src={atcl.IMAGE_URL} className='w-full md:w-64 md:h-64 mx-auto' alt="news" />
              <div className="block">
                <div className='text-black hover:text-[#0085A1] cursor-pointer'>
                  <h2 className="text-4xl font-bold transition-colors mb-2">
                    <a href={atcl.URL} target='_blank' rel='noopener noreferrer'>{atcl.TITLE}</a>
                  </h2>
                </div>
                <div className="text-lg">
                  {atcl.BODY.length > 255
                    ? `${atcl.BODY.slice(0, 200).split(' ').slice(0, -1).join(' ')}...`
                    : atcl.BODY}
                </div>
                <div className="text-gray-500 py-2">
                  {new Date(atcl.PUBLISHED_ON* 1000).toDateString()}
                </div>
                <div className='flex flex-row flex-wrap gap-2 text-blue-600'>
                  {atcl.CATEGORY_DATA.map((cat: any, idx: number) => (
                    <div key={idx} className='bg-blue-100 rounded-xl px-4 py-1 text-sm'>
                      {cat.CATEGORY}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-8 flex justify-center">
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< previous"
              containerClassName="flex items-center space-x-2"
              pageClassName="px-3 py-1 border border-gray-300 rounded"
              activeClassName="bg-gray-800 text-white"
              previousClassName="px-3 py-1 border border-gray-300 rounded"
              nextClassName="px-3 py-1 border border-gray-300 rounded"
              disabledClassName="opacity-50 cursor-not-allowed"
            />
          </div>
        )}
      </div>
    </main>
  );
}
