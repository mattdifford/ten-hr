require "storyblok"
 
module Jekyll
  class StoryblokPage < Page
    def initialize(site, base, dir, story, links, global)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'
 
      # We will use the root component (eg. content type) as layout
      layout = story['content']['component']
 
      self.process(@name)
      # Jekyll provides the processed layouts in the site.layouts hash, so we will use it here!
      # This makes it possible to use gem-based Jekyll themes.
      self.data    = site.layouts[layout].data.dup
      self.content = site.layouts[layout].content.dup
 
      # Assign the received data from the Storyblok API as variables
      self.data['story'] = story
      self.data['title'] = story['name']
      self.data['links'] = links
      self.data['global'] = global
    end
  end
 
  class StoryblokPageGenerator < Generator
    safe true
 
    def generate(site)
      @storyblok_config = site.config['storyblok']
      raise 'Missing Storyblok configuration in _config.yml' unless @storyblok_config
 
      link = client.links['data']['links']
      stories = client.stories(per_page:100, page:1)['data']['stories']

      global = client.story('global')
      stories.each do |story|
        create_page(site, story, link, global)
      end
    end
 
    private
 
    def client
      @client ||= ::Storyblok::Client.new(
        token: @storyblok_config['token'],
        version: @storyblok_config['version'],
      )
    end
 
    def create_page(site, story, link, global)
      
      if story['full_slug'] == 'home'
        site.pages << StoryblokPage.new(site, site.source, '', story, link, global)
      elsif story['full_slug'] != 'global'
        site.pages << StoryblokPage.new(site, site.source, story['full_slug'], story, link, global)
      end
    end
  end
end