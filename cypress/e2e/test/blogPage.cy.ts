import { HomePage } from "../pages/home-page";
import { CommonActions } from "../pages/common-actions";
import { BlogPage } from "../pages/blog-page";

describe('Blog Page Navigation', () => {
  it('should navigate to Blog page from Resources menu and verify blog posts', { tags: ["@smoke", "@regression"] }, () => {
    HomePage.visitHomePage();
    CommonActions.navigateToDropdownOption('Resources', 'Blog');
    cy.url().should('include', '/blog');
    
    BlogPage.checkBlogPageAndGetPostCount().then((postCount) => {
      cy.step(`Blog page contains ${postCount} posts`);
    });
  });

  it('should open first 3 articles, analyze word frequency, and save to file', { tags: ["@comprehensive", "@regression"] }, () => {
    HomePage.visitHomePage();
    CommonActions.navigateToDropdownOption('Resources', 'Blog');
    cy.url().should('include', '/blog');
    
    BlogPage.openArticlesAndExtractText(3).then((articleTexts) => {
      cy.step(`Extracted text from ${articleTexts.length} articles`);
      const wordCounts = BlogPage.findMostRepeatedWords(articleTexts, 5);
      cy.step('Analyzed word frequency in articles');
      const fileContent = `Most Repeated Words in Latest 3 Blog Articles\n` +
        `Generated on: ${new Date().toISOString()}\n` +
        `Total articles analyzed: ${articleTexts.length}\n\n` +
        `Top 5 Most Repeated Words:\n` +
        Object.entries(wordCounts)
          .map(([word, count]) => `${word}: ${count} times`)
          .join('\n') + '\n\n' +
        `Article Text Lengths:\n` +
        articleTexts.map((text, index) => `Article ${index + 1}: ${text.length} characters`).join('\n');
      
      cy.task('writeFile', {
        filePath: 'cypress/downloads/word-frequency-analysis.txt',
        content: fileContent
      }).then(() => {
        cy.step('Word frequency analysis saved to file');
        cy.step('File saved: cypress/downloads/word-frequency-analysis.txt');
        
        cy.step('Top 5 most repeated words:');
        Object.entries(wordCounts).forEach(([word, count]) => {
          cy.step(`${word}: ${count} times`);
        });
      });
    });
  });
});
