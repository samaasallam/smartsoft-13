#encoding: UTF-8
class Synonym < ActiveRecord::Base
  attr_accessible :approved, :name, :keyword_id, :is_formal

  belongs_to :keyword
  has_many :votes, uniq: true
  has_many :gamers, through: :vote, uniq: true

  def existing?
    if !Keyword.exists?(id: keyword_id)
      errors.add(:keyword_id, "#{I18n.t(:not_existing_error)}")
    end
  end

  validates_format_of :name, with: /^([\u0621-\u0652 ])+$/,
    message: "#{I18n.t(:invalid_format_error)}" 
  validates_presence_of :name, message: "#{I18n.t(:empty_name_error)}"
  validate :existing?
  validates_uniqueness_of :name, scope: :keyword_id,
    message: "#{I18n.t(:duplicate_error)}"

  class << self
    include StringHelper
  end

  # author:
  #   kareem ali
  # Description:
  #   records a synonym for a specific keyword with approved = false by default
  # Params:
  #   synonym_name: the string name of the new synonym
  #   keyword_id: the id of the keyword for which the synonym is suggested
  #   approved: whether the syonnym is approved or not , by default is not approved 
  # Success:
  #   returns 0 when the synonym is saved
  # Failure:
  #   returns 1 when the synonym written by the gamer is blank
  #   returns 2 when the synonym is already existing
  #   returns 4 when the gamer didn't choose formal or slang to the synonym
  def self.record_suggested_synonym(synonym_name, keyword_id, approved = true, is_formal)
    if synonym_name.blank?
      return  1
    elsif Synonym.exists?(name: synonym_name, keyword_id: keyword_id)
      return  2
    elsif synonym_name.match(/^([\u0621-\u0652 ])+$/) == nil
        return 3
    elsif is_formal == nil
      return 4
    elsif Keyword.exists?(id: keyword_id)
        new_synonym = Synonym.new
        new_synonym.name = synonym_name
        new_synonym.keyword_id = keyword_id
        new_synonym.approved = approved
        new_synonym.is_formal = is_formal
        if new_synonym.save
          return 0
        else
          return 3
        end
    end
  end 

  
  # Author:
  #   Mirna Yacout
  # Description:
  #   This method is to record the disapproval of the admin to a certain synonym in the database
  # Parameters:
  #   id: the id of the synonym to be disapproved
  # Success:
  #   returns true on saving the disapproval correctly in the database
  # Failure:
  #   returns false if the synonym doesnot exist in the database
  #   or if the disapproval failed to be saved in the database     
	def self.disapprove_synonym(synonym_id)
    if Synonym.exists?(id: synonym_id)
      synonym = Synonym.find(synonym_id)
      synonym.approved = false
      return synonym.save
    end
    return false
  end

  class << self
    # Author:
    #   Mohamed Tamer
    # Description:
    #   finds the synonym for a word
    # Params:
    #   synonym_name: the synonym name
    #   keyword_id: the keyword id
    # Success:
    #   Returns the synonym model
    # Failure:
    #   Returns nil
    def find_by_name(synonym_name, keyword_id)
      word = Keyword.find(keyword_id)
      synonym = Synonym.where("name = ? AND keyword_id = ?", synonym_name, keyword_id).first
    end
  end

  # Author:
  #   Omar Hossam
  # Description:
  #   Feature, record suggested synonym for a given word. The function saves
  #   synonym to database and returns boolean only or boolean and the new
  #   synonym depending on the input parameters.
  # Parameters:
  #   synonym_name: string input parameter that represents the synonym name.
  #   keyword_id: integer input parameter representing the keyword id
  #   the synonym points to.
  #   full_output: an optioanl boolean input parameter with a default false,
  #   which returns the new synonym model if set to true.
  #   approved: an optional boolean input parameter with a default false
  #   represents if an admin has approved a synonym on database or not.
  #   is_formal: a boolean input parameter that indicates if synonym is formal,
  #   and if not entered when recording synonym, it gets setted with nil.
  # Success:
  #   this method returns true and the new synonym model (if full_output is set
  #   to true) if the synonym has been recorded.
  # Failure: 
  #   returns false and uncompleted model for the new synonym (if full_output is
  #   set to true) if word not saved to database due to synonym name not being
  #   in arabic or an incorrect keyword id for an unavaialable keyword in
  #   database or a dupplicate synonym for the same keyword.
  def self.record_synonym(synonym_name, keyword_id, full_output = false, approved = true, is_formal = nil)
    new_synonym = Synonym.new
    new_synonym.name = synonym_name
    new_synonym.keyword_id = keyword_id
    new_synonym.approved = approved
    new_synonym.is_formal = is_formal
    if full_output
      return new_synonym.save , new_synonym
    else
      return new_synonym.save
    end
  end

  # Author: 
  #   Nourhan Zakaria
  # Description:
  #   This method is used to get the countries of voters who voted for certain 
  #     synonym along with the percentage of voters belonging to each country
  #   It can also get voters filtered according certain filters if they exists
  # Params: 
  #   --
  # Success: 
  #   a list of lists, each one of the inner lists consists of  
  #     a key and value.
  #   The key represents the country and the value is the percentage of voters 
  #     that belong to this country
  # Failure: 
  #   returns an empty list if no gamers voted for this synonym yet or if
  #     non of the voters satisifies filtering conditions
  def get_visual_stats_country(gender, country, education, age_from, age_to)
    voters = Gamer.joins(:synonyms).where("synonym_id = ?", self.id)

    voters = voters
      .where("gender = ?", gender) unless gender.blank?
    voters = voters
      .where("country = ?", country) unless country.blank?
    voters = voters
      .where("education_level = ?", education) unless education.blank?
    voters = voters
      .where("date_of_birth <= ?", age_from.years.ago.to_date) unless age_from.blank?
    voters = voters
      .where("date_of_birth >= ?", age_to.years.ago.to_date) unless age_to.blank?

    groups = voters.count(group: :country)

    sum = groups.sum{ |v| v.last }
    mapping = groups.map { |key, value| [key.downcase.tr(" ", "_"), value] }
    mapping.map { |key, value| [I18n.t(key), ((value.to_f / sum) * 100).to_i] }
  end 

  # Author: 
  #   Nourhan Zakaria
  # Description:
  #   This method is used to get the percentage of females and males who voted 
  #     for certain synonym. It can also get voters filtered according certain 
  #     filters if they exists 
  # Params: 
  #   --
  # Success: 
  #   a list of lists, each one of the inner lists consists of 
  #     a key and value.
  #   The key represents the gender and the value is the percentage of voters 
  #     belonging to this gender.
  # Failure: 
  #   returns an empty list if no gamers voted for this synonym yet or if
  #     non of the voters satisifies filtering conditions
  def get_visual_stats_gender(gender, country, education, age_from, age_to)
    voters = Gamer.joins(:synonyms).where("synonym_id = ?", self.id)

    voters = voters
      .where("gender = ?", gender) unless gender.blank?
    voters = voters
      .where("country = ?", country) unless country.blank?
    voters = voters
      .where("education_level = ?", education) unless education.blank?
    voters = voters
      .where("date_of_birth <= ?", age_from.years.ago.to_date) unless age_from.blank?
    voters = voters
      .where("date_of_birth >= ?", age_to.years.ago.to_date) unless age_to.blank?

    groups = voters.count(group: :gender)

    sum = groups.sum{ |v| v.last }
    mapping = groups.map { |key, value| [key.downcase.tr(" ", "_"), value] }
    mapping.map { |key, value| [I18n.t(key), ((value.to_f / sum) * 100).to_i] }
  end 

  # Author: 
  #   Nourhan Zakaria
  # Description:
  #   This method is used to get the percentage of gamers, who voted for 
  #     certain synonym, belonging to each age groups. It can also
  #     get voters filtered according certain filters if they exists 
  # Params: 
  #   --
  # Success: 
  #   a list of lists, each one of the inner lists consists of 
  #     a key and value.
  #   The key represents the age group and the value is the percentage of 
  #     voters belong to this age group.
  # Failure: 
  #   returns an empty list if no gamers voted for this synonym yet or if
  #     non of the voters satisifies filtering conditions
  def get_visual_stats_age(gender, country, education, age_from, age_to)
    voters = Gamer.joins(:synonyms).where("synonym_id = ?", self.id)

    voters = voters
      .where("gender = ?", gender) unless gender.blank?
    voters = voters
      .where("country = ?", country) unless country.blank?
    voters = voters
      .where("education_level = ?", education) unless education.blank?
    voters = voters
      .where("date_of_birth <= ?", age_from.years.ago.to_date) unless age_from.blank?
    voters = voters
      .where("date_of_birth >= ?", age_to.years.ago.to_date) unless age_to.blank?
    
    groupOne = voters.select("date_of_birth").group("date_of_birth")
    .having("date_of_birth <= ? AND date_of_birth >= ?", 
    10.years.ago.to_date, 25.years.ago.to_date).count
    one = groupOne.sum{ |v| v.last }

    groupTwo = voters.select("date_of_birth").group("date_of_birth")
    .having("date_of_birth < ? AND date_of_birth >= ?", 
    25.years.ago.to_date, 45.years.ago.to_date).count
    two = groupTwo.sum{ |v| v.last }

    groupThree = voters.select("date_of_birth").group("date_of_birth")
    .having("date_of_birth < ?", 45.years.ago.to_date).count
    three = groupThree.sum{ |v| v.last }

    sum = one + two + three
    if sum != 0
      list = [["10-25", one], ["26-45", two], ["46+", three]]
      list.map { |key, value| [key, ((value.to_f / sum) * 100).to_i] }
    else
      []
    end
  end 

  # Author: 
  #   Nourhan Zakaria
  # Description:
  #   This method is used to get the percentage of gamers, who voted for 
  #     certain synonym, belonging to each educational level.It can also
  #     get voters filtered according certain filters if they exists
  # Params: 
  #   --
  # Success: 
  #   a list of lists, each one of the inner lists consists of 
  #     a key and value.
  #   The key represents the education level and the value is the percentage 
  #     of voters having this education level.
  # Failure: 
  #   returns an empty list if no gamers voted for this synonym yet or if
  #     non of the voters satisifies filtering conditions
  def get_visual_stats_education(gender, country, education, age_from, age_to)
    voters = Gamer.joins(:synonyms).where("synonym_id = ?", self.id)

    voters = voters
      .where("gender = ?", gender) unless gender.blank?
    voters = voters
      .where("country = ?", country) unless country.blank?
    voters = voters
      .where("education_level = ?", education) unless education.blank?
    voters = voters
      .where("date_of_birth <= ?", age_from.years.ago.to_date) unless age_from.blank?
    voters = voters
      .where("date_of_birth >= ?", age_to.years.ago.to_date) unless age_to.blank?

    groups = voters.count(group: :education_level)

    sum = groups.sum{ |v| v.last }
    mapping = groups.map { |key, value| [key.downcase.tr(" ", "_"), value] }
    mapping.map { |key, value| [I18n.t(key), ((value.to_f / sum) * 100).to_i] }
  end
end
