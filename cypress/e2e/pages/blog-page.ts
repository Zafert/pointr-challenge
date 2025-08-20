import { ApiPage } from "./api-page";

const blogSelectors = {
  allArticles: '.single_article.d-flex.flex-column',
  articlePostsContainer: '.blog-posts',
  articleLink: '.single-article--link a',
  articleContent: '.blog-post-main__wrapper'
};

export class BlogPage {

  static checkBlogPageAndGetPostCount(): Cypress.Chainable<number> {
    cy.step('check blog page and get post count');
    return cy.get(blogSelectors.articlePostsContainer).within(() => {
        cy.get(blogSelectors.allArticles).then(($posts) => {
        const postCount = $posts.length;
        cy.step(`Found ${postCount} blog posts on the page`);
      });
    }).then(() => {
      return cy.get(`${blogSelectors.articlePostsContainer} ${blogSelectors.allArticles}`).then(($posts) => {
        return $posts.length;
      });
    });
  }

  static openArticlesAndExtractText(count: number = 3): Cypress.Chainable<string[]> {
    cy.step(`opening first ${count} articles and extracting text content`);  
    const articleTexts: string[] = [];
    const processArticle = (index: number): Cypress.Chainable<string[]> => {
      if (index >= count) {
        return cy.wrap(articleTexts);
      }
      
      cy.step(`Processing article ${index + 1}`);
      
      return cy.get(blogSelectors.allArticles).eq(index).find(blogSelectors.articleLink).invoke('attr', 'href').then((href) => {
        if (href) {
          cy.step(`Article ${index + 1} href: ${href}`);
          
           ApiPage.interceptLinkedInAds();
           return cy.visit(href).then(() => {
             cy.url().should('include', '/blog/');
             cy.wait(`@${ApiPage.getAliases().LINKEDIN_ADS}`, { timeout: 10000 });
             
             return cy.get(blogSelectors.articleContent).then(($content) => {
               const text = $content.text().trim();
               articleTexts.push(text);
               cy.step(`Article ${index + 1} text length: ${text.length} characters`);
               
               ApiPage.interceptLinkedInAds();
               cy.go('back');
               cy.url().should('include', '/blog');
               cy.wait(`@${ApiPage.getAliases().LINKEDIN_ADS}`, { timeout: 10000 });
               
               return processArticle(index + 1);
             });
           });
        } else {
          cy.step(`Article ${index + 1} has no href, skipping to next`);
          return processArticle(index + 1);
        }
      });
    };
    
    return processArticle(0);
  }

  static findMostRepeatedWords(texts: string[], topCount: number = 5): { [key: string]: number } {
    const wordCount: { [key: string]: number } = {};
    
    texts.forEach(text => {
      const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2);
      
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
    });
    
    const sortedWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, topCount);
    
    const result: { [key: string]: number } = {};
    sortedWords.forEach(([word, count]) => {
      result[word] = count;
    });
    
    return result;
  }
}
