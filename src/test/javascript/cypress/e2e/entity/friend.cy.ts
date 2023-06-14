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

describe('Friend e2e test', () => {
  const friendPageUrl = '/friend';
  const friendPageUrlPattern = new RegExp('/friend(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const friendSample = {};

  let friend;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/friends+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/friends').as('postEntityRequest');
    cy.intercept('DELETE', '/api/friends/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (friend) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/friends/${friend.id}`,
      }).then(() => {
        friend = undefined;
      });
    }
  });

  it('Friends menu should load Friends page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('friend');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Friend').should('exist');
    cy.url().should('match', friendPageUrlPattern);
  });

  describe('Friend page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(friendPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Friend page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/friend/new$'));
        cy.getEntityCreateUpdateHeading('Friend');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', friendPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/friends',
          body: friendSample,
        }).then(({ body }) => {
          friend = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/friends+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [friend],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(friendPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Friend page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('friend');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', friendPageUrlPattern);
      });

      it('edit button click should load edit Friend page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Friend');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', friendPageUrlPattern);
      });

      it('edit button click should load edit Friend page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Friend');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', friendPageUrlPattern);
      });

      it('last delete button click should delete instance of Friend', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('friend').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', friendPageUrlPattern);

        friend = undefined;
      });
    });
  });

  describe('new Friend page', () => {
    beforeEach(() => {
      cy.visit(`${friendPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Friend');
    });

    it('should create an instance of Friend', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        friend = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', friendPageUrlPattern);
    });
  });
});
