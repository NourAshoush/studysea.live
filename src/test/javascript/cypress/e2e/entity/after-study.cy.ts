import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('AfterStudy e2e test', () => {
  const afterStudyPageUrl = '/after-study';
  const afterStudyPageUrlPattern = new RegExp('/after-study(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const afterStudySample = {};

  let afterStudy;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/after-studies+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/after-studies').as('postEntityRequest');
    cy.intercept('DELETE', '/api/after-studies/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (afterStudy) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/after-studies/${afterStudy.id}`,
      }).then(() => {
        afterStudy = undefined;
      });
    }
  });

  it('AfterStudies menu should load AfterStudies page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('after-study');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AfterStudy').should('exist');
    cy.url().should('match', afterStudyPageUrlPattern);
  });

  describe('AfterStudy page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(afterStudyPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AfterStudy page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/after-study/new$'));
        cy.getEntityCreateUpdateHeading('AfterStudy');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', afterStudyPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/after-studies',
          body: afterStudySample,
        }).then(({ body }) => {
          afterStudy = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/after-studies+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [afterStudy],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(afterStudyPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AfterStudy page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('afterStudy');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', afterStudyPageUrlPattern);
      });

      it('edit button click should load edit AfterStudy page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AfterStudy');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', afterStudyPageUrlPattern);
      });

      it('edit button click should load edit AfterStudy page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AfterStudy');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', afterStudyPageUrlPattern);
      });

      it('last delete button click should delete instance of AfterStudy', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('afterStudy').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', afterStudyPageUrlPattern);

        afterStudy = undefined;
      });
    });
  });

  describe('new AfterStudy page', () => {
    beforeEach(() => {
      cy.visit(`${afterStudyPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AfterStudy');
    });

    it('should create an instance of AfterStudy', () => {
      cy.get(`[data-cy="timeSpent"]`).type('PT50M').blur().should('have.value', 'PT50M');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        afterStudy = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', afterStudyPageUrlPattern);
    });
  });
});
