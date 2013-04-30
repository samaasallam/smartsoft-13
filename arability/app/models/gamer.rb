#encoding:utf-8
class Gamer < ActiveRecord::Base

  has_many :authentications
  has_and_belongs_to_many :prizes
  has_and_belongs_to_many :trophies
  has_many :votes
  has_many :synonyms, :through => :votes

  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable

   devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessor :login
  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, 
                  :username, :country, :education_level, :date_of_birth,
                  :highest_score, :gender, :login, :is_local, :show_tutorial

  has_many :services, :dependent => :destroy

  validates :gender , :presence => true, :format => { :with => /\A^(male|female)\Z/i }

  validates :username, presence: true, uniqueness: true,
    length: { minimum: 3, maximum: 20 }

  validates :username, :format => { :with => /^[A-Za-z]([\._]?[A-Za-z0-9]+)*$/, }

  validates :country, :presence => true, :length => { :minimum => 2 }

  validates :education_level, :format => { :with => /\A^(School|University|Graduate)\Z/i }
  
  validates :date_of_birth, :date => { :after_or_equal_to => 95.years.ago, 
    :before_or_equal_to => 10.years.ago }


  # Author:
  #   Adam Ghanem
  # Description
  #   method that needs to be overwritten for devise so that
  #   we can find a Gamer by a given username OR email
  # params:
  #   gamer_conditions: a hash of the form
  #   'username: "adam"', 'email: "a@email.com"'
  # success:
  #   returns the Gamer with the given conditions
  # failure:
  #   returns nil for not being able to find any gamer
  #   with the given conditions
  def self.find_for_database_authentication(gamer_conditions)
    conditions = gamer_conditions.dup
    if login = conditions.delete(:login)
      where(conditions).where(
        ["lower(username) = :value OR lower(email) = :value",
                               { value: login.downcase }]).first
    else
      where(conditions).first
    end
  end

  # Description:
  #   Takes in a trophy id and adds it the gamers trophies array
  # Author:
  #   Adam Ghanem
  # @params:
  #   trophy_id
  # returns:
  #   success:
  #     returns true validating that the gamer has received
  #     this trophy_id
  #   failure:
  #     returns false validating that the gamer has either
  #     failed to get rewarded this trophy
  def receive_trophy(trohpy_id)
    trophy = Trophy.find(trophy_id)
    
    if trophy == nil
      return false
    end
    
    if self.trophies.include? trophy
      return false
    else
      self.trophies << trophy
      return true
    end
  end

  # Description:
  #   Takes in a prize id and adds it the gamers prizes array
  # Author:
  #   Adam Ghanem
  # @params:
  #   prize_id
  # returns:
  #   success:
  #     returns true validating that the gamer has received
  #     this trophy_id
  #   failure:
  #     returns false validating that the gamer has either
  #     failed to get rewarded this prize
  def receive_prize(prize_id)
    prize = Prize.find(prize_id)
    
    if prize == nil
      return false
    end
    
    if self.prizes.include? prize
      return false
    else
      self.prizes << prize
      return true
    end
  end
  
  # Description:
  #   returns a list of the gamers won prizes
  # Author:
  #   Adam Ghanem
  # @params:
  #   none
  # returns:
  #   success:
  #     an array of the prizes that the gamer has won
  #   failure:
  #     no failure
  def get_won_prizes
    return self.prizes
  end

  # Description:
  #   returns a list of the gamers prizes
  # Author:
  #   Adam Ghanem
  # @params:
  #   none
  # returns:
  #   success:
  #     an array of the prizes that the gamer can win
  #   failure:
  #     no failure
  def get_available_prizes
    return Prize.all - self.prizes
  end

  # Description:
  #   returns a list of the trophies that the gamer won
  # Author:
  #   Adam Ghanem
  # @params:
  #   none
  # returns:
  #   success:
  #     an array of the trophies that the gamer has won
  #   failure:
  #     no failure
  def get_won_trophies
    return self.trophies
  end
  

  # Author:
  #   Kareem Ali
  # Description:
  #   invokes record_synonym method of the Vote class
  # Params:
  #   synonym_id: which is the synonym id of the synonym for which 
  #               the gamer is voting.
  # Success:
  #   returns true when a vote is saved for the selected synonym
  # Failure:
  #   returns false when the vote is not saved
  def select_synonym(synonym_id, is_formal = nil)
    if Vote.record_vote(self.id,synonym_id)[0]
      if is_formal != nil
        synonym = Synonym.find(synonym_id)
        synonym.is_formal = is_formal
        synonym.save
      end
      return true
    else
      return false
    end
  end

  # Author:
  #   Kareem Ali
  # Description:
  #   invokes record_suggested_synonym method of the Synonym class
  # Params:
  #   synonym_name: which is the synonym name the gamer suggested in the  
  #                 vote form.
  #   keyword_id: is the id of keyword for which the synonym is being added
  #   is_formal: determine whether the synonym is formal or slang
  # Success:
  #   returns 0 returned by the invoked method meaning saved new synonym
  # Failure:
  #   returns 1,2,3 according to the invoked method failure scenario
  def suggest_synonym(synonym_name, keyword_id, is_formal)
    return Synonym.record_suggested_synonym(synonym_name, keyword_id, true ,is_formal)
  end
    

  # Description:
  #   returns a list of the gamers prizes
  # Author:
  #   Adam Ghanem
  # @params:
  #   none
  # returns:
  #   success:
  #     an array of the prizes that the gamer has won
  #   failure:
  #     no failure
  def get_available_trophies
    return Trophy.all - self.trophies
  end

  def won_prizes?(score, level)
    if Prize.get_new_prizes_for_gamer(self.id, score, level).count > 0
      return true
    else
      return false
    end
  end

  #scopes defined for advanced search aid
  scope :filter_by_country, lambda { |country| where(:country.casecmp(country) == 0) }
  scope :filter_by_dob, lambda { |from, to| where :date_of_birth => to.years.ago..from.years.ago }
  scope :filter_by_gender, lambda { |gender| where :gender => gender }
  scope :filter_by_education, lambda { |education| where :education_level => education }

  class << self
    # Author:
    #  Mirna Yacout
    # Description:
    #  This method is to retrieve the list of common arability friends and Facebook friends
    # Parameters:
    #  current_gamer: the record in Gamer table for the current user
    # Success:
    #  returns the list of common followers
    # Failure:
    #  returns nil if no gamer token is found
    def get_common_facebook_friends(current_gamer)
      if (current_gamer.token.nil?)
        return nil
      end
      @graph = Koala::Facebook::API.new(current_gamer.get_token)
      friends = @graph.get_connections("me", "friends")
      common = Array.new
      i = 0
      while i<friends.count
        if Gamer.exists?(:uid => friends.at(i)["id"], :provider => "facebook")
          common.push(Gamer.find_by_uid_and_provider(friends.at(i), "facebook").id)
          common.push(current_gamer.id)
        end
        i = i + 1
        return common
      end
    end
  end

  # Author:
  #   Amr Abdelraouf
  # Description:
  #   Creates a new gamer without the need of an input password
  # Params:
  #   email: user email
  #   username: user username
  #   gender: user gender
  #   d_o_b: user date of birth
  #   country: user country
  #   ed_level: user educational level
  # Sucess:
  #   New gamer is created with said attributes, returns the gamer and true
  # Failure:
  #   Gamer not saved because of validations, returns nil and false
  def self.create_with_social_account(
    email, username, gender, d_o_b, country, ed_level)
    gamer = Gamer.new(
      email: email,
      username: username,
      password: Devise.friendly_token[0,20],
      gender: gender,
      date_of_birth: d_o_b,
      country: country,
      education_level: ed_level,
      is_local: false)
    if gamer.save
      return gamer, true
    else
      return gamer, false
    end
  end

# Author:
#   Amr Abdelraouf
# Description
#   Returns whether this account has been created locally
#   or by a social media account
# Params:
#   None
# Success:
#   Returns boolean whether or not is local
# Failure:
#   None
def is_local_account
  is_local
end

  #scopes defined for advanced search aid
  scope :filter_by_country, lambda { |country| where 'country LIKE ?', country }
  scope :filter_by_dob, lambda { |from, to| where :date_of_birth => to.years.ago..from.years.ago }
  scope :filter_by_gender, lambda { |gender| where :gender => gender }
  scope :filter_by_education, lambda { |education| where :education_level => education }
end

