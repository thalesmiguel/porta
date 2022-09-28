# frozen_string_literal: true

require 'test_helper'

class Provider::Admin::DashboardsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @provider = FactoryBot.create(:provider_account, org_name: 'Company')
    user = FactoryBot.create(:admin, account: provider)
    user.activate!
    login!(provider, user: user)
  end

  attr_reader :provider

  test 'new accounts widget' do
    Ability.any_instance.stubs(:can?).returns(true).at_least_once
    xpath_selector = './/div[@id="new-accounts-widget"]'

    get provider_admin_dashboard_path
    assert_xpath(xpath_selector)
  end

  test 'potential upgrades widget' do
    Ability.any_instance.stubs(:can?).returns(true).at_least_once
    xpath_selector = './/div[@id="potential-upgrades-widget"]'

    get provider_admin_dashboard_path
    assert_xpath(xpath_selector)
  end

  test 'products and backends widgets' do
    xpath_selector = './/section[@id="apis"]'
    element_text = 'APIs'

    User.any_instance.stubs(:access_to_service_admin_sections?).returns(true)
    get provider_admin_dashboard_path
    assert_xpath(xpath_selector, element_text)
  end

  test 'new accounts widget no access' do
    Ability.any_instance.stubs(:can?).returns(false).at_least_once
    xpath_selector = './/div[@id="new-accounts-widget"]'

    get provider_admin_dashboard_path
    refute_xpath(xpath_selector)
  end

  test 'potential upgrades widget no access' do
    Ability.any_instance.stubs(:can?).returns(false).at_least_once
    xpath_selector = './/div[@id="potential-upgrades-widget"]'

    get provider_admin_dashboard_path
    refute_xpath(xpath_selector)
  end

  test 'products and backends widgets no access' do
    xpath_selector = './/section[@id="apis"]'
    element_text = "You don't have access to any API on the #{provider.org_name} account. Please contact #{provider.decorate.admin_user_display_name} to request access."

    User.any_instance.stubs(:access_to_service_admin_sections?).returns(false)
    get provider_admin_dashboard_path
    assert_xpath(xpath_selector, element_text)
  end
end
