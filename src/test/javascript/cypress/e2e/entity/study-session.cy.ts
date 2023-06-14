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

describe('StudySession e2e test', () => {
  const studySessionPageUrl = '/study-session';
  const studySessionPageUrlPattern = new RegExp('/study-session(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const studySessionSample = {};

  let studySession;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/study-sessions+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/study-sessions').as('postEntityRequest');
    cy.intercept('DELETE', '/api/study-sessions/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (studySession) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/study-sessions/${studySession.id}`,
      }).then(() => {
        studySession = undefined;
      });
    }
  });

  it('StudySessions menu should load StudySessions page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('study-session');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('StudySession').should('exist');
    cy.url().should('match', studySessionPageUrlPattern);
  });

  describe('StudySession page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(studySessionPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create StudySession page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/study-session/new$'));
        cy.getEntityCreateUpdateHeading('StudySession');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', studySessionPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/study-sessions',
          body: studySessionSample,
        }).then(({ body }) => {
          studySession = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/study-sessions+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [studySession],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(studySessionPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details StudySession page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('studySession');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', studySessionPageUrlPattern);
      });

      it('edit button click should load edit StudySession page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('StudySession');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', studySessionPageUrlPattern);
      });

      it('edit button click should load edit StudySession page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('StudySession');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', studySessionPageUrlPattern);
      });

      it('last delete button click should delete instance of StudySession', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('studySession').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', studySessionPageUrlPattern);

        studySession = undefined;
      });
    });
  });

  describe('new StudySession page', () => {
    beforeEach(() => {
      cy.visit(`${studySessionPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('StudySession');
    });

    it('should create an instance of StudySession', () => {
      cy.get(`[data-cy="actualStart"]`).type('2023-04-18T21:18').blur().should('have.value', '2023-04-18T21:18');

      cy.get(`[data-cy="isPrivate"]`).should('not.be.checked');
      cy.get(`[data-cy="isPrivate"]`).click().should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        studySession = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', studySessionPageUrlPattern);
    });
  });
});
