describe('EquipmentSelector popup test', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('/fd2/direct_seeding/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Equipment plus button exists, is visible, is enabled', () => {
    cy.get('.accordion-button').click();
    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-add-button"]')
      .should('exist')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Form removes links', () => {
    cy.get('.accordion-button').click();
    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-add-button"]')
      .click();

    cy.get('[data-cy="selector-popupIframe"]', { timeout: 10000 })
      .should('be.visible')
      .its('0.contentDocument.body', { timeout: 10000 })
      .should('not.be.empty')
      .then(cy.wrap)
      .as('iframeBody');

    cy.get('@iframeBody')
      .find('.gin-secondary-toolbar.layout-container')
      .should('not.exist');

    cy.get('@iframeBody')
      .find('header', { timeout: 10000 })
      .should('have.css', 'top', '0px');

    cy.get('@iframeBody').find('.gin--vertical-toolbar').should('not.exist');

    cy.get('@iframeBody').find('#toolbar-administration').should('not.exist');

    cy.get('[data-cy="selector-closePopup"]').click();
  });

  it('Form selects new Equipment', () => {
    cy.get('.accordion-button').click();
    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-add-button"]')
      .click();

    cy.get('[data-cy="selector-popupIframe"]', { timeout: 10000 })
      .should('be.visible')
      .its('0.contentDocument.body', { timeout: 10000 })
      .should('not.be.empty')
      .then(cy.wrap)
      .as('iframeBody');

    cy.get('@iframeBody')
      .find('[id="edit-name-0-value"]', { timeout: 10000 })
      .should('be.visible') // Ensure the input field is visible
      .type('NewEquipment');

    cy.get('@iframeBody')
      .find('[id="edit-submit"]', { timeout: 10000 })
      .should('be.visible') // Ensure the submit button is visible
      .click();

    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-input"]', { timeout: 10000 })
      .should('have.value', 'NewEquipment');
  });

  it('Form checks Url', () => {
    cy.get('.accordion-button').click();
    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-add-button"]')
      .click();

    cy.get('[data-cy="selector-popupIframe"]', { timeout: 10000 }).then(
      ($iframe) => {
        $iframe.attr('src', 'http://farmos/fd2/tray_seeding');
      }
    );

    cy.get('[data-cy="selector-overlay"]').should('not.exist');
    cy.get('[data-cy="selector-popup"]').should('not.exist');
    cy.get('[data-cy="selector-closePopup"]').should('not.exist');
    cy.get('[data-cy="selector-popupIframe"]').should('not.exist');
  });
});