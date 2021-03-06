import RecipeList from 'components/RecipeList';

import RecipeModal from 'components/RecipeModal';
import Recipe from 'components/Recipe';

describe('<RecipeList />', () => {
  let wrapper, instance, initialState, newState, showModal;

  beforeEach(() => {
    initialState = {
      recipes: [
        {
          name: 'Sample Recipe',
          description: 'This is a sample recipe',
          ingredients: 'tomato,salt,water'
        }
      ],
      recipeModal: {
        isHidden: true,
        selectedRecipe: null,
        selectedId: null,
        mode: ''
      }
    };

    newState = {
      recipes: [
        ...initialState.recipes,
        {
          name: 'Test recipe',
          description: 'This is a test recipe',
          ingredients: 'pizza,spaghetti,drinks'
        },
        {
          name: 'Test recipe2',
          description: 'This is a test recipe2',
          ingredients: 'pizzas,spaghettis,drinks'
        }
      ]
    };

    wrapper = shallow(<RecipeList />);
    instance = wrapper.instance();
  });

  it('should be a div', () => {
    expect(wrapper).to.have.type('div');
  });

  it('should have proper initial state', () => {
    expect(wrapper).to.have.state('recipes').deep.equal(initialState.recipes);
    expect(wrapper).to.have.state('recipeModal').deep.equal(initialState.recipeModal);
  });

  describe('CRUD Methods', () => {
    let hideModalSpy, showModalSpy;

    beforeEach(() => {
      hideModalSpy = spy(instance, 'hideModal');
      showModalSpy = spy(instance, 'showModal');
    });

    afterEach(() => {
      hideModalSpy.restore();
      showModalSpy.restore();
    });

    it('should have method createRecipe() that updates recipes state', () => {
      const recipe = {
        name: 'Test recipe',
        description: 'This is a test recipe',
        ingredients: 'pizza,spaghetti,drinks'
      };

      initialState.recipes.push(recipe);
      instance.createRecipe(recipe);

      expect(wrapper).to.have.state('recipes').deep.equal(initialState.recipes);
      expect(showModalSpy).to.have.been.calledOnce;
      expect(showModalSpy).to.have.been.calledWith(1,'read');
    });

    it('should have method updateRecipe() that updates recipes state', () => {
      const newRecipe = {
        name: 'Updated recipe',
        description: 'This is an updated recipe',
        ingredients: 'updated pizza, updated spaghetti, updated drinks'
      };

      instance.setState({ recipes: [...newState.recipes] });

      newState.recipes[1] = newRecipe;

      instance.updateRecipe(1, newRecipe);

      expect(wrapper).to.have.state('recipes').deep.equal(newState.recipes);
      expect(showModalSpy).to.have.been.calledOnce;
      expect(showModalSpy).to.have.been.calledWith(1,'read');
    });

    it('should have method deleteRecipe() that updates recipes state', () => {
      instance.setState({ recipes: [...newState.recipes] });

      newState.recipes.splice(1,1);

      instance.deleteRecipe(1);

      expect(wrapper).to.have.state('recipes').deep.equal(newState.recipes);
      expect(hideModalSpy).to.have.been.calledOnce;
    });
  });

  describe('Modal Methods', () => {
    it('should have method showModal() that sets recipeModal state (incl. CRUD)', () => {
      wrapper.setState({ recipes: [...newState.recipes] });

      instance.showModal(null, 'create');

      expect(wrapper).to.have.state('recipeModal').deep.equal({
        isHidden: false,
        selectedRecipe: null,
        selectedId: null,
        mode: 'create'
      });

      [0, 1, 2].map(id => {
        wrapper.setState({ recipeModal: initialState.recipeModal });

        instance.showModal(id, 'read');

        expect(wrapper).to.have.state('recipeModal').deep.equal({
          isHidden: false,
          selectedRecipe: newState.recipes[id],
          selectedId: id,
          mode: 'read'
        });
      });

      [0, 1, 2].map(id => {
        wrapper.setState({ recipeModal: initialState.recipeModal });

        instance.showModal(id, 'update');

        expect(wrapper).to.have.state('recipeModal').deep.equal({
          isHidden: false,
          selectedRecipe: newState.recipes[id],
          selectedId: id,
          mode: 'update'
        });
      });

      [0, 1, 2].map(id => {
        wrapper.setState({ recipeModal: initialState.recipeModal });

        instance.showModal(id, 'delete');

        expect(wrapper).to.have.state('recipeModal').deep.equal({
          isHidden: false,
          selectedRecipe: newState.recipes[id],
          selectedId: id,
          mode: 'delete'
        });
      });
    });

    it('should have method hideModal() the resets recipeModal state', () => {
      const recipeModal = {
        isHidden: false,
        selectedRecipe: newState.recipes[1],
        selectedId: 1,
        mode: 'read'
      };

      instance.setState({ recipeModal });

      instance.hideModal();

      expect(wrapper).to.have.state('recipeModal').deep.equal(initialState.recipeModal);
    });
  });

  it('should contain a <RecipeModal /> with correct props', () => {
    expect(wrapper).to.have.exactly(1).descendants(RecipeModal);

    const modalSubject = wrapper.find(RecipeModal).first();

    expect(modalSubject).to.have.prop('isHidden').equal(initialState.recipeModal.isHidden);
    expect(modalSubject).to.have.prop('recipe').equal(initialState.recipeModal.selectedRecipe);
    expect(modalSubject).to.have.prop('recipeId').equal(initialState.recipeModal.selectedId);
    expect(modalSubject).to.have.prop('mode').equal(initialState.recipeModal.mode);
    expect(modalSubject).to.have.prop('onCreate').equal(instance.createRecipe);
    expect(modalSubject).to.have.prop('onUpdate').equal(instance.updateRecipe);
    expect(modalSubject).to.have.prop('onDelete').equal(instance.deleteRecipe);
    expect(modalSubject).to.have.prop('onHide').equal(instance.hideModal);
    expect(modalSubject).to.have.prop('switchModal').equal(instance.showModal);
  });

  it('should contain a list-group', () => {
    expect(wrapper).to.have.exactly(1).descendants('.list-group');
  });

  it('should render a <Recipe /> for each recipe', () => {
    instance.setState({ recipes: [...newState.recipes] });

    expect(wrapper.find('.list-group')).to.have.exactly(3).descendants(Recipe);

    const recipeWrapper = wrapper.find(Recipe);

    [0,1,2].map(id => {
      expect(recipeWrapper.at(id)).to.have.prop('recipeName').equal(newState.recipes[id].name);
    });
  });

  it('should contain a button', () => {
    expect(wrapper).to.have.exactly(1).descendants('button');
  });

  describe('Add New Recipe Button', () => {
    let buttonWrapper;

    beforeEach(() => {
      buttonWrapper = wrapper.find('button');
    });

    it('should have text "Create Recipe"', () => {
      expect(buttonWrapper).to.have.text('Create Recipe');
    });
  });
});
