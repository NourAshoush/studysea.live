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

describe('UserExtended e2e test', () => {
  const userExtendedPageUrl = '/user-extended';
  const userExtendedPageUrlPattern = new RegExp('/user-extended(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const userExtendedSample = {};

  let userExtended;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-extendeds+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-extendeds').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-extendeds/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userExtended) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-extendeds/${userExtended.id}`,
      }).then(() => {
        userExtended = undefined;
      });
    }
  });

  it('UserExtendeds menu should load UserExtendeds page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-extended');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserExtended').should('exist');
    cy.url().should('match', userExtendedPageUrlPattern);
  });

  describe('UserExtended page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userExtendedPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserExtended page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-extended/new$'));
        cy.getEntityCreateUpdateHeading('UserExtended');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userExtendedPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-extendeds',
          body: userExtendedSample,
        }).then(({ body }) => {
          userExtended = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-extendeds+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [userExtended],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userExtendedPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserExtended page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userExtended');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userExtendedPageUrlPattern);
      });

      it('edit button click should load edit UserExtended page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserExtended');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userExtendedPageUrlPattern);
      });

      it('edit button click should load edit UserExtended page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserExtended');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userExtendedPageUrlPattern);
      });

      it('last delete button click should delete instance of UserExtended', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userExtended').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userExtendedPageUrlPattern);

        userExtended = undefined;
      });
    });
  });

  describe('new UserExtended page', () => {
    beforeEach(() => {
      cy.visit(`${userExtendedPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserExtended');
    });

    it('should create an instance of UserExtended', () => {
      cy.get(`[data-cy="firstName"]`).type('Khalil').should('have.value', 'Khalil');

      cy.get(`[data-cy="lastName"]`).type('Gerhold').should('have.value', 'Gerhold');

      cy.get(`[data-cy="email"]`).type('Dagmar.Kertzmann57@yahoo.com').should('have.value', 'Dagmar.Kertzmann57@yahoo.com');

      cy.get(`[data-cy="status"]`).type('SMS').should('have.value', 'SMS');

      cy.get(`[data-cy="institution"]`).type('Home').should('have.value', 'Home');

      cy.get(`[data-cy="course"]`).type('Implementation Developer Berkshire').should('have.value', 'Implementation Developer Berkshire');

      cy.get(`[data-cy="description"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="privacy"]`).should('not.be.checked');
      cy.get(`[data-cy="privacy"]`).click().should('be.checked');

      cy.get(`[data-cy="darkMode"]`).should('not.be.checked');
      cy.get(`[data-cy="darkMode"]`).click().should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userExtended = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userExtendedPageUrlPattern);
    });
  });
});
