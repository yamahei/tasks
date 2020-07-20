require "spec_helper"
require "biz"

describe "Biz" do
  before do
    @biz = Biz.new
  end

  context "hoge" do

    before do
      @plan_a = @biz.create_plan "A", "2019-03-23", "2019-03-30"
      @plan_b = @biz.create_plan "B", "2019-05-01", "2019-05-10"
    end
    after do
      @biz.destroy_plan @plan_a.id
      @biz.destroy_plan @plan_b.id
    end

    it "whats do i do" do
      expect { @biz.create_plan nil, "2019-03-23", "2019-03-30" }.to raise_error(ActiveRecord::NotNullViolation)
      expect(plan).to be_a Plan
      expect(plan.to  ).to eq Date.new(2019, 3, 30)
    end

  end

end