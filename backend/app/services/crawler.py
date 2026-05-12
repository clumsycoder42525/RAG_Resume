import httpx
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import asyncio
import logging

logger = logging.getLogger(__name__)

class WebCrawler:
    def __init__(self, max_depth: int = 2, max_pages: int = 20):
        self.max_depth = max_depth
        self.max_pages = max_pages
        self.visited = set()
        self.content = []

    async def crawl(self, url: str, depth: int = 0):
        if depth > self.max_depth or url in self.visited or len(self.visited) >= self.max_pages:
            return

        self.visited.add(url)
        logger.info(f"Crawling: {url} at depth {depth}")

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url)
                if response.status_code != 200:
                    return

                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Extract text (cleaning navigation/footers could be more aggressive)
                for script in soup(["script", "style"]):
                    script.decompose()
                
                text = soup.get_text(separator=' ', strip=True)
                if text:
                    self.content.append({
                        "url": url,
                        "text": text
                    })

                # Find links
                if depth < self.max_depth:
                    links = soup.find_all('a', href=True)
                    tasks = []
                    base_domain = urlparse(url).netloc
                    
                    for link in links:
                        next_url = urljoin(url, link['href'])
                        # Only crawl same domain
                        if urlparse(next_url).netloc == base_domain:
                            tasks.append(self.crawl(next_url, depth + 1))
                    
                    if tasks:
                        await asyncio.gather(*tasks)

        except Exception as e:
            logger.error(f"Error crawling {url}: {e}")

    def get_results(self):
        return self.content

# Usage: crawler = WebCrawler(); await crawler.crawl(url); results = crawler.get_results()
