import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';

describe('Test the PicklistBase component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "valid" when component has been created', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        rows: [],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [],
        units: 'Trays',
        quantityAttribute: 'quantity',
        showValidityStyling: true,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Emits "update:picked" and "valid" when a row is picked', () => {
    const readySpy = cy.spy().as('readySpy');
    const updatePickedSpy = cy.spy().as('updatePickedSpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updatePickedSpy,
        onValid: validSpy,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [1, 0],
        units: null,
        quantityAttribute: 'quantity',
        showValidityStyling: true,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-checkbox-1"]').check();
        cy.get('@updatePickedSpy').should('have.been.calledWith', [1, 1]);
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits "update:picked" and "valid" when all button is clicked', () => {
    const readySpy = cy.spy().as('readySpy');
    const updatePickedSpy = cy.spy().as('updatePickedSpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updatePickedSpy,
        onValid: validSpy,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [0, 0],
        units: null,
        quantityAttribute: 'quantity',
        showValidityStyling: true,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-all-button"]').click();
        cy.get('@updatePickedSpy').should('have.been.calledWith', [1, 1]);
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits "update:picked" and "valid" when units button is clicked', () => {
    const readySpy = cy.spy().as('readySpy');
    const updatePickedSpy = cy.spy().as('updatePickedSpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updatePickedSpy,
        onValid: validSpy,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [0, 0],
        units: 'Trays',
        quantityAttribute: 'quantity',
        showValidityStyling: true,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-units-button"]').click();
        cy.get('@updatePickedSpy').should('have.been.calledWith', [1, 2]);
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits "update:picked" and "valid" when rows prop is updated', () => {
    const readySpy = cy.spy().as('readySpy');
    const updatePickedSpy = cy.spy().as('updatePickedSpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updatePickedSpy,
        onValid: validSpy,
        rows: [{ name: 'Item A', quantity: 1, location: 'GHANA' }],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [0],
        units: 'Trays',
        quantityAttribute: 'quantity',
        showValidityStyling: true,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledWith', false);

        // Update the props to load new data
        cy.wrap({ updateProps: (props) => Cypress.vueWrapper.setProps(props) })
          .invoke('updateProps', {
            rows: [
              { name: 'Item A', quantity: 1, location: 'GHANA' },
              { name: 'Item B', quantity: 2, location: 'GHANA' },
            ],
            picked: [1, 1],
          })
          .then(() => {
            cy.get('@updatePickedSpy').should('have.been.calledWith', [1, 1]);
            cy.get('@validSpy').should('have.been.calledWith', true);
          });
      });
  });
});
