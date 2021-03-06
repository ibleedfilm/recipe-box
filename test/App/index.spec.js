import App from 'App';

import RecipeList from 'components/RecipeList';
import NavBar from 'components/NavBar';

describe('<App />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it('should be a div', () => {
    expect(wrapper).to.have.type('div');
  });

  it('should render <RecipeList />', () => {
    expect(wrapper).to.contain(<RecipeList />);
  });

  it('should render <NavBar />', () => {
    expect(wrapper).to.have.exactly(1).descendants(NavBar);
  })
});
