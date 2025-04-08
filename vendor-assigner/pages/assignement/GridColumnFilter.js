


export class GridColumnFilter {
  constructor(page) {
    this.page = page;
    this.kebabMenu = page.getByRole('button', { name: 'Menu' })
    this.kebabMenuPartnerTypeOption = page.getByRole('menuitem', { name: 'Filter by Partner Type' });
    this.kebabMenuPartnerStatusOption = page.getByRole('menuitem', { name: 'Filter by Partner Status' });
    this.kebabMenuPartnerNameOption = page.getByRole('menuitem', { name: 'Filter by Partner Name' });
    this.columnHeaderPartnerAssignament = page.locator('div:nth-child(12) > .MuiDataGrid-columnHeaderDraggableContainer');
    this.filterBox = page.locator('.MuiDataGrid-filterForm');
    this.filterBoxColumnPartnerAssignamentDropDown = this.filterBox.getByText('ColumnsPartner Assignment');
    this.filterBoxOperatorPartnerTypeDropDown = this.filterBox.getByText('OperatorPartner Type Is');
    this.filterBoxValuesDropDown = page.locator('//*[@id="filter-menu-control"]');
    this.filterBoxValuesDropDownPlaceHolder = this.filterBoxValuesDropDown.getByText('Select Partner Type');
    this.filterBoxValuesDropDownList = page.locator('ul[role="listbox"]');
    this.filterBoxValuesDropDownOptions = page.locator('ul[role="listbox"] li');
  };
};



