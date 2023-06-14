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

describe('LeagueTable e2e test', () => {
  const leagueTablePageUrl = '/league-table';
  const leagueTablePageUrlPattern = new RegExp('/league-table(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const leagueTableSample = {};

  let leagueTable;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/league-tables+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/league-tables').as('postEntityRequest');
    cy.intercept('DELETE', '/api/league-tables/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (leagueTable) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/league-tables/${leagueTable.id}`,
      }).then(() => {
        leagueTable = undefined;
      });
    }
  });

  it('LeagueTables menu should load LeagueTables page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('league-table');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('LeagueTable').should('exist');
    cy.url().should('match', leagueTablePageUrlPattern);
  });

  describe('LeagueTable page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(leagueTablePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create LeagueTable page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/league-table/new$'));
        cy.getEntityCreateUpdateHeading('LeagueTable');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', leagueTablePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/league-tables',
          body: leagueTableSample,
        }).then(({ body }) => {
          leagueTable = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/league-tables+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [leagueTable],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(leagueTablePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details LeagueTable page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('leagueTable');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', leagueTablePageUrlPattern);
      });

      it('edit button click should load edit LeagueTable page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LeagueTable');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', leagueTablePageUrlPattern);
      });

      it('edit button click should load edit LeagueTable page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LeagueTable');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', leagueTablePageUrlPattern);
      });

      it('last delete button click should delete instance of LeagueTable', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('leagueTable').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', leagueTablePageUrlPattern);

        leagueTable = undefined;
      });
    });
  });

  describe('new LeagueTable page', () => {
    beforeEach(() => {
      cy.visit(`${leagueTablePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('LeagueTable');
    });

    it('should create an instance of LeagueTable', () => {
      cy.get(`[data-cy="name"]`).type('Tuna').should('have.value', 'Tuna');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        leagueTable = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', leagueTablePageUrlPattern);
    });
  });
});
